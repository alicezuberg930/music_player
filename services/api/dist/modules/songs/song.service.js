import { esmMusicMetadata } from '../../lib/helpers/esm.module';
import fs from 'node:fs';
import NodeID3 from 'node-id3';
// database
import { db, eq, inArray, and } from '@yukikaze/db';
import { artists, songs, artistsSongs, userFavoriteSongs } from '@yukikaze/db/schemas';
// utils
import { HttpException, BadRequestException, NotFoundException } from '@yukikaze/lib/exception';
import slugify from '../../lib/helpers/slugify';
import { deleteFile, extractPublicId, uploadFile } from "../../lib/helpers/cloudinary.file";
import { createId } from "@yukikaze/lib/create-cuid";
import { resizeImageToBuffer } from '@yukikaze/lib/image-resize';
export class SongService {
    async getSongs(request, response) {
        try {
            const {} = request.query;
            const userId = request.userId; // Get user ID from JWT middleware (undefined if not logged in)
            const data = await db.query.songs.findMany({
                with: {
                    user: { columns: { password: false, email: false } },
                    genres: {
                        columns: { id: false, genreId: false, songId: false },
                        with: { genre: true }
                    },
                    artists: {
                        columns: { id: false, artistId: false, songId: false },
                        with: { artist: true }
                    }
                }
            }).then(result => result.map(song => ({
                ...song,
                artists: song.artists.map(a => a.artist),
                genres: song.genres.map(g => g.genre)
            })));
            // If user is logged in, check which songs they've liked
            let likedSongIds = new Set();
            if (userId) {
                const songIds = data.map(song => song.id);
                const likedSongs = await db.query.userFavoriteSongs.findMany({
                    where: and(eq(userFavoriteSongs.userId, userId), inArray(userFavoriteSongs.songId, songIds)),
                    columns: { songId: true }
                });
                likedSongIds = new Set(likedSongs.map(ls => ls.songId));
            }
            const songsWithLikedStatus = data.map(song => ({
                ...song,
                liked: likedSongIds.has(song.id)
            }));
            return response.json({ message: 'Song list fetched successfully', data: songsWithLikedStatus });
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async createSong(request, response) {
        try {
            const { title, releaseDate, artistIds } = request.body;
            const files = request.files;
            const audioFile = files['audio']?.[0] ?? null;
            if (!audioFile)
                throw new BadRequestException('Audio file is required');
            const lyricsFile = files['lyrics']?.[0] ?? null;
            const thumbnailFile = files['thumbnail']?.[0] ?? null;
            // initialize urls
            let lyricsUrl = null;
            let thumbnailUrl = null;
            // find artist names from artistIds
            const findArtists = await db.query.artists.findMany({ columns: { name: true }, where: inArray(artists.id, artistIds) });
            // extract metadata from audio file
            let metadata = await esmMusicMetadata().then(m => m.parseFile(audioFile.path));
            if (lyricsFile) {
                lyricsUrl = (await uploadFile({ files: lyricsFile, subFolder: '/lyrics', publicId: createId() }));
            }
            if (thumbnailFile) {
                // if the user uploaded a thumbnail file, embed it into the audio file's metadata
                NodeID3.update({
                    title,
                    releaseTime: releaseDate,
                    artist: findArtists.map(a => a.name).join("/"),
                    originalReleaseTime: releaseDate,
                    year: new Date(releaseDate).getFullYear().toString(),
                    originalYear: new Date(releaseDate).getFullYear().toString(),
                    image: {
                        mime: thumbnailFile.mimetype,
                        type: { id: 3, name: 'Album cover' },
                        description: 'Cover Art',
                        imageBuffer: fs.readFileSync(thumbnailFile.path)
                    }
                }, audioFile.path);
                // Read file into buffer first to release file handle
                const originalBuffer = fs.readFileSync(thumbnailFile.path);
                // Resize image from buffer
                const resizedBuffer = await resizeImageToBuffer(originalBuffer, {
                    height: 100, width: 100,
                    aspectRatio: '1:1',
                    fit: 'cover',
                });
                fs.writeFileSync(thumbnailFile.path, resizedBuffer);
                thumbnailUrl = (await uploadFile({ files: thumbnailFile, subFolder: '/cover', publicId: createId() }));
            }
            else {
                const picture = metadata.common.picture?.[0];
                if (picture) {
                    const coverPath = `uploads/${Date.now() + '-' + Math.round(Math.random() * 1e9)}.${picture.format.split('/')[1]}`;
                    fs.writeFileSync(coverPath, Buffer.from(picture.data));
                    // Read file into buffer first to release file handle
                    const originalBuffer = fs.readFileSync(coverPath);
                    // Resize image from buffer
                    const resizedBuffer = await resizeImageToBuffer(originalBuffer, {
                        height: 100, width: 100,
                        aspectRatio: '1:1',
                        fit: 'cover',
                    });
                    fs.writeFileSync(coverPath, resizedBuffer);
                    const coverFile = {
                        path: coverPath,
                        mimetype: picture.format,
                        originalname: `cover.${picture.format.split('/')[1]}`
                    };
                    thumbnailUrl = (await uploadFile({ files: coverFile, subFolder: '/cover', publicId: createId() }));
                }
            }
            console.log(thumbnailUrl);
            // upload audio file to cloud storage and get the url
            const audioUrl = await uploadFile({ files: audioFile, subFolder: '/audio', publicId: createId() });
            const song = {
                title, releaseDate,
                userId: request.userId,
                size: audioFile.size,
                alias: slugify(title),
                duration: Math.floor(metadata.format.duration ?? 0),
                artistNames: findArtists.map(a => a.name).join(", "),
                hasLyrics: !!lyricsFile,
                stream: audioUrl,
                lyricsFile: lyricsUrl,
                thumbnail: thumbnailUrl ?? '/assets/default/default-song-thumbnail.png'
            };
            const insertSong = await db.insert(songs).values(song).$returningId();
            await db.insert(artistsSongs).values(artistIds.map(artistId => ({
                songId: insertSong[0].id, artistId
            })));
            return response.status(201).json({ message: 'Song created successfully' });
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async updateSong(request, response) {
        try {
            const { id } = request.params;
            const findSong = await db.query.songs.findFirst({
                where: eq(songs.id, id),
                columns: { thumbnail: true, stream: true, lyricsFile: true }
            });
            if (!findSong)
                throw new NotFoundException('Song not found');
            const { releaseDate, title, artistIds } = request.body;
            const files = request.files;
            // const audioFile: Express.Multer.File | null = files['audio']?.[0] ?? null
            const lyricsFile = files['lyrics']?.[0] ?? null;
            const thumbnailFile = files['thumbnail']?.[0] ?? null;
            let thumbnail = null;
            let lyrics = null;
            let findArtists = [];
            // filter artistIds to add and remove
            if (artistIds && artistIds.length > 0) {
                findArtists = await db.query.artists.findMany({ columns: { name: true }, where: inArray(artists.id, artistIds) });
                const existingArtistSongs = await db.query.artistsSongs.findMany({
                    where: eq(artistsSongs.songId, id),
                    columns: { artistId: true }
                });
                const existingArtistIds = existingArtistSongs.map(a => a.artistId);
                const artistIdsToAdd = artistIds.filter(aid => !existingArtistIds.includes(aid));
                const artistIdsToRemove = existingArtistIds.filter(aid => !artistIds.includes(aid));
                if (artistIdsToAdd.length > 0) {
                    await db.insert(artistsSongs).values(artistIdsToAdd.map(artistId => ({
                        songId: id, artistId
                    })));
                }
                // remove old artist-song relations
                if (artistIdsToRemove.length > 0) {
                    await db.delete(artistsSongs).where(and(eq(artistsSongs.songId, id), inArray(artistsSongs.artistId, artistIdsToRemove)));
                }
            }
            if (lyricsFile) {
                if (findSong.lyricsFile) {
                    await uploadFile({ files: lyricsFile, publicId: extractPublicId(findSong.lyricsFile) });
                }
                else {
                    lyrics = (await uploadFile({ files: lyricsFile, subFolder: '/lyrics', publicId: createId() }));
                }
            }
            if (thumbnailFile) {
                // Read file into buffer first to release file handle
                const originalBuffer = fs.readFileSync(thumbnailFile.path);
                // Resize image from buffer
                const resizedBuffer = await resizeImageToBuffer(originalBuffer, {
                    height: 100, width: 100,
                    aspectRatio: '1:1',
                    fit: 'cover',
                });
                fs.writeFileSync(thumbnailFile.path, resizedBuffer);
                if (findSong.thumbnail.includes('/assets/')) {
                    thumbnail = (await uploadFile({ files: thumbnailFile, subFolder: '/cover', publicId: createId() }));
                }
                else {
                    await uploadFile({ files: thumbnailFile, publicId: extractPublicId(findSong.thumbnail) });
                }
            }
            const song = {
                ...findArtists.length > 0 && { artistNames: findArtists.map(a => a.name).join(", ") },
                ...releaseDate && ({ releaseDate }),
                ...title && ({ title }),
                ...thumbnail && { thumbnail },
                ...lyrics && {
                    lyricsFile: lyrics,
                    hasLyrics: true
                },
            };
            if (Object.entries(song).length > 0)
                await db.update(songs).set(song).where(eq(songs.id, id));
            return response.json({ message: 'Song updated successfully' });
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async findSong(request, response) {
        try {
            const { id } = request.params;
            const data = await db.query.songs.findFirst({
                where: eq(songs.id, id),
                with: {
                    user: {
                        columns: { password: false, email: false }
                    },
                    genres: {
                        columns: { id: false, genreId: false, songId: false },
                        with: { genre: true }
                    },
                    artists: {
                        columns: { id: false, artistId: false, songId: false },
                        with: { artist: true }
                    }
                }
            }).then(song => song ? ({
                ...song,
                artists: song.artists.map(s => s.artist),
                genres: song.genres.map(g => g.genre)
            }) : undefined);
            if (!data)
                throw new NotFoundException('Song not found');
            return response.json({ message: 'Song fetched successfully', data });
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async deleteSong(request, response) {
        try {
            const findSong = await db.query.songs.findFirst({
                where: eq(songs.id, request.params.id),
                columns: { stream: true, lyricsFile: true, thumbnail: true }
            });
            if (!findSong)
                throw new NotFoundException('Song not found');
            const deleteUrls = [
                findSong.stream,
                ...(findSong.lyricsFile ? [findSong.lyricsFile] : []),
                ...(findSong.thumbnail && !findSong.thumbnail.includes('/assets/') ? [findSong.thumbnail] : [])
            ];
            await deleteFile(deleteUrls);
            await db.delete(songs).where(eq(songs.id, request.params.id));
            return response.json({ message: 'Song deleted successfully' });
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
}
