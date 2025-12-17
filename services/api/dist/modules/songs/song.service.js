"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongService = void 0;
const music_metadata_1 = __importDefault(require("music-metadata"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_id3_1 = __importDefault(require("node-id3"));
// database
const db_1 = require("@yukikaze/db");
const schemas_1 = require("@yukikaze/db/schemas");
// utils
const exception_1 = require("@yukikaze/lib/exception");
const slugify_1 = __importDefault(require("@yukikaze/lib/slugify"));
const cloudinary_1 = require("@yukikaze/lib/cloudinary");
const create_cuid_1 = require("@yukikaze/lib/create-cuid");
const image_resize_1 = require("@yukikaze/lib/image-resize");
class SongService {
    async getSongs(request, response) {
        try {
            const {} = request.query;
            const userId = request.userId; // Get user ID from JWT middleware (undefined if not logged in)
            console.log(request.userId);
            const data = await db_1.db.query.songs.findMany({
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
                const likedSongs = await db_1.db.query.userFavoriteSongs.findMany({
                    where: (0, db_1.and)((0, db_1.eq)(schemas_1.userFavoriteSongs.userId, userId), (0, db_1.inArray)(schemas_1.userFavoriteSongs.songId, songIds)),
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
            if (error instanceof exception_1.HttpException)
                throw error;
            throw new exception_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async createSong(request, response) {
        try {
            const { title, releaseDate, artistIds } = request.body;
            const files = request.files;
            const audioFile = files['audio']?.[0] ?? null;
            if (!audioFile)
                throw new exception_1.BadRequestException('Audio file is required');
            const lyricsFile = files['lyrics']?.[0] ?? null;
            const thumbnailFile = files['thumbnail']?.[0] ?? null;
            // initialize urls
            let lyricsUrl = null;
            let thumbnailUrl = null;
            // find artist names from artistIds
            const findArtists = await db_1.db.query.artists.findMany({ columns: { name: true }, where: (0, db_1.inArray)(schemas_1.artists.id, artistIds) });
            // extract metadata from audio file
            const metadata = await music_metadata_1.default.parseFile(audioFile.path);
            // let metadata = await esmMusicMetadata().then(m => m.parseFile(audioFile.path))
            if (lyricsFile) {
                lyricsUrl = (await (0, cloudinary_1.uploadFile)({ files: lyricsFile, subFolder: '/lyrics', publicId: (0, create_cuid_1.createId)() }));
            }
            if (thumbnailFile) {
                // if the user uploaded a thumbnail file, embed it into the audio file's metadata
                node_id3_1.default.update({
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
                        imageBuffer: node_fs_1.default.readFileSync(thumbnailFile.path)
                    }
                }, audioFile.path);
                // Read file into buffer first to release file handle
                const originalBuffer = node_fs_1.default.readFileSync(thumbnailFile.path);
                // Resize image from buffer
                const resizedBuffer = await (0, image_resize_1.resizeImageToBuffer)(originalBuffer, {
                    height: 100, width: 100,
                    aspectRatio: '1:1',
                    fit: 'cover',
                });
                node_fs_1.default.writeFileSync(thumbnailFile.path, resizedBuffer);
                thumbnailUrl = (await (0, cloudinary_1.uploadFile)({ files: thumbnailFile, subFolder: '/cover', publicId: (0, create_cuid_1.createId)() }));
            }
            else {
                const picture = metadata.common.picture?.[0];
                if (picture) {
                    const coverPath = `uploads/${Date.now() + '-' + Math.round(Math.random() * 1e9)}.${picture.format.split('/')[1]}`;
                    node_fs_1.default.writeFileSync(coverPath, Buffer.from(picture.data));
                    // Read file into buffer first to release file handle
                    const originalBuffer = node_fs_1.default.readFileSync(coverPath);
                    // Resize image from buffer
                    const resizedBuffer = await (0, image_resize_1.resizeImageToBuffer)(originalBuffer, {
                        height: 100, width: 100,
                        aspectRatio: '1:1',
                        fit: 'cover',
                    });
                    node_fs_1.default.writeFileSync(coverPath, resizedBuffer);
                    const coverFile = {
                        path: coverPath,
                        mimetype: picture.format,
                        originalname: `cover.${picture.format.split('/')[1]}`
                    };
                    thumbnailUrl = (await (0, cloudinary_1.uploadFile)({ files: coverFile, subFolder: '/cover', publicId: (0, create_cuid_1.createId)() }));
                }
            }
            console.log(thumbnailUrl);
            // upload audio file to cloud storage and get the url
            const audioUrl = await (0, cloudinary_1.uploadFile)({ files: audioFile, subFolder: '/audio', publicId: (0, create_cuid_1.createId)() });
            const song = {
                title, releaseDate,
                userId: request.userId,
                size: audioFile.size,
                alias: (0, slugify_1.default)(title),
                duration: Math.floor(metadata.format.duration ?? 0),
                artistNames: findArtists.map(a => a.name).join(", "),
                hasLyrics: !!lyricsFile,
                stream: audioUrl,
                lyricsFile: lyricsUrl,
                thumbnail: thumbnailUrl ?? '/assets/default/default-song-thumbnail.png'
            };
            const insertSong = await db_1.db.insert(schemas_1.songs).values(song).$returningId();
            await db_1.db.insert(schemas_1.artistsSongs).values(artistIds.map(artistId => ({
                songId: insertSong[0].id, artistId
            })));
            return response.status(201).json({ message: 'Song created successfully' });
        }
        catch (error) {
            if (error instanceof exception_1.HttpException)
                throw error;
            throw new exception_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async updateSong(request, response) {
        try {
            const { id } = request.params;
            const findSong = await db_1.db.query.songs.findFirst({
                where: (0, db_1.eq)(schemas_1.songs.id, id),
                columns: { thumbnail: true, stream: true, lyricsFile: true }
            });
            if (!findSong)
                throw new exception_1.NotFoundException('Song not found');
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
                findArtists = await db_1.db.query.artists.findMany({ columns: { name: true }, where: (0, db_1.inArray)(schemas_1.artists.id, artistIds) });
                const existingArtistSongs = await db_1.db.query.artistsSongs.findMany({
                    where: (0, db_1.eq)(schemas_1.artistsSongs.songId, id),
                    columns: { artistId: true }
                });
                const existingArtistIds = existingArtistSongs.map(a => a.artistId);
                const artistIdsToAdd = artistIds.filter(aid => !existingArtistIds.includes(aid));
                const artistIdsToRemove = existingArtistIds.filter(aid => !artistIds.includes(aid));
                if (artistIdsToAdd.length > 0) {
                    await db_1.db.insert(schemas_1.artistsSongs).values(artistIdsToAdd.map(artistId => ({
                        songId: id, artistId
                    })));
                }
                // remove old artist-song relations
                if (artistIdsToRemove.length > 0) {
                    await db_1.db.delete(schemas_1.artistsSongs).where((0, db_1.and)((0, db_1.eq)(schemas_1.artistsSongs.songId, id), (0, db_1.inArray)(schemas_1.artistsSongs.artistId, artistIdsToRemove)));
                }
            }
            if (lyricsFile) {
                if (findSong.lyricsFile) {
                    await (0, cloudinary_1.uploadFile)({ files: lyricsFile, publicId: (0, cloudinary_1.extractPublicId)(findSong.lyricsFile) });
                }
                else {
                    lyrics = (await (0, cloudinary_1.uploadFile)({ files: lyricsFile, subFolder: '/lyrics', publicId: (0, create_cuid_1.createId)() }));
                }
            }
            if (thumbnailFile) {
                // Read file into buffer first to release file handle
                const originalBuffer = node_fs_1.default.readFileSync(thumbnailFile.path);
                // Resize image from buffer
                const resizedBuffer = await (0, image_resize_1.resizeImageToBuffer)(originalBuffer, {
                    height: 100, width: 100,
                    aspectRatio: '1:1',
                    fit: 'cover',
                });
                node_fs_1.default.writeFileSync(thumbnailFile.path, resizedBuffer);
                if (findSong.thumbnail.includes('/assets/')) {
                    thumbnail = (await (0, cloudinary_1.uploadFile)({ files: thumbnailFile, subFolder: '/cover', publicId: (0, create_cuid_1.createId)() }));
                }
                else {
                    await (0, cloudinary_1.uploadFile)({ files: thumbnailFile, publicId: (0, cloudinary_1.extractPublicId)(findSong.thumbnail) });
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
                await db_1.db.update(schemas_1.songs).set(song).where((0, db_1.eq)(schemas_1.songs.id, id));
            return response.json({ message: 'Song updated successfully' });
        }
        catch (error) {
            if (error instanceof exception_1.HttpException)
                throw error;
            throw new exception_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async findSong(request, response) {
        try {
            const { id } = request.params;
            const data = await db_1.db.query.songs.findFirst({
                where: (0, db_1.eq)(schemas_1.songs.id, id),
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
                throw new exception_1.NotFoundException('Song not found');
            return response.json({ message: 'Song fetched successfully', data });
        }
        catch (error) {
            if (error instanceof exception_1.HttpException)
                throw error;
            throw new exception_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async deleteSong(request, response) {
        try {
            const findSong = await db_1.db.query.songs.findFirst({
                where: (0, db_1.eq)(schemas_1.songs.id, request.params.id),
                columns: { stream: true, lyricsFile: true, thumbnail: true }
            });
            if (!findSong)
                throw new exception_1.NotFoundException('Song not found');
            const deleteUrls = [
                findSong.stream,
                ...(findSong.lyricsFile ? [findSong.lyricsFile] : []),
                ...(findSong.thumbnail && !findSong.thumbnail.includes('/assets/') ? [findSong.thumbnail] : [])
            ];
            await (0, cloudinary_1.deleteFile)(deleteUrls);
            await db_1.db.delete(schemas_1.songs).where((0, db_1.eq)(schemas_1.songs.id, request.params.id));
            return response.json({ message: 'Song deleted successfully' });
        }
        catch (error) {
            if (error instanceof exception_1.HttpException)
                throw error;
            throw new exception_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
}
exports.SongService = SongService;
