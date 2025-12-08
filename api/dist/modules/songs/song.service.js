"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongService = void 0;
const esm_module_1 = require("../../lib/helpers/esm.module");
const node_fs_1 = __importDefault(require("node:fs"));
const node_id3_1 = __importDefault(require("node-id3"));
// database
const db_1 = require("../../db");
const schemas_1 = require("../../db/schemas");
// utils
const exceptions_1 = require("../../lib/exceptions");
const slugify_1 = __importDefault(require("../../lib/helpers/slugify"));
const cloudinary_file_1 = require("../../lib/helpers/cloudinary.file");
const utils_1 = require("../../db/utils");
class SongService {
    async getSongs(request, response) {
        try {
            const {} = request.query;
            const userId = request.userId; // Get user ID from JWT middleware (undefined if not logged in)
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
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async createSong(request, response) {
        try {
            const { title, releaseDate, artistIds } = request.body;
            const files = request.files;
            const audioFile = files['audio']?.[0] ?? null;
            if (!audioFile)
                throw new exceptions_1.BadRequestException('Audio file is required');
            const lyricsFile = files['lyrics']?.[0] ?? null;
            const thumbnailFile = files['thumbnail']?.[0] ?? null;
            // initialize urls
            let lyricsUrl = null;
            let thumbnailUrl = null;
            // find artist names from artistIds
            const findArtists = await db_1.db.query.artists.findMany({ columns: { name: true }, where: (0, db_1.inArray)(schemas_1.artists.id, artistIds) });
            // extract metadata from audio file
            let metadata = await (0, esm_module_1.esmMusicMetadata)().then(m => m.parseFile(audioFile.path));
            if (lyricsFile) {
                lyricsUrl = (await (0, cloudinary_file_1.uploadFile)(lyricsFile, '/lyrics', (0, utils_1.createId)()));
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
                thumbnailUrl = (await (0, cloudinary_file_1.uploadFile)(thumbnailFile, '/cover', (0, utils_1.createId)()));
            }
            else {
                const picture = metadata.common.picture?.[0];
                if (picture) {
                    const coverPath = `uploads/${Date.now() + '-' + Math.round(Math.random() * 1e9)}.${picture.format.split('/')[1]}`;
                    node_fs_1.default.writeFileSync(coverPath, Buffer.from(picture.data));
                    const coverFile = {
                        path: coverPath,
                        mimetype: picture.format,
                        originalname: `cover.${picture.format.split('/')[1]}`
                    };
                    thumbnailUrl = (await (0, cloudinary_file_1.uploadFile)(coverFile, '/cover', (0, utils_1.createId)()));
                }
            }
            // upload audio file to cloud storage and get the url
            const audioUrl = await (0, cloudinary_file_1.uploadFile)(audioFile, '/audio', (0, utils_1.createId)());
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
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async updateSong(request, response) {
        try {
            const { id } = request.params;
            const findSong = await db_1.db.query.songs.findFirst({ where: (0, db_1.eq)(schemas_1.songs.id, id), columns: { thumbnail: true, stream: true, lyricsFile: true } });
            if (!findSong)
                throw new exceptions_1.NotFoundException('Song not found');
            const { releaseDate, title, artistIds } = request.body;
            const files = request.files;
            const audioFile = files['audio']?.[0] ?? null;
            const lyricsFile = files['lyrics']?.[0] ?? null;
            const thumbnailFile = files['thumbnail']?.[0] ?? null;
            let thumbnail = null;
            let lyrics = null;
            let findArtists = [];
            // find artist names from artistIds array
            if (artistIds && artistIds.length > 0) {
                await db_1.db.delete(schemas_1.artistsSongs).where((0, db_1.eq)(schemas_1.artistsSongs.songId, id));
                await db_1.db.insert(schemas_1.artistsSongs).values(artistIds.map(artistId => ({ songId: id, artistId })));
                findArtists = await db_1.db.query.artists.findMany({ columns: { name: true }, where: (0, db_1.inArray)(schemas_1.artists.id, artistIds) });
            }
            // extract metadata from audio file
            let metadata = audioFile ? await (0, esm_module_1.esmMusicMetadata)().then(m => m.parseFile(audioFile.path)) : null;
            if (lyricsFile) {
                if (!findSong.lyricsFile) {
                    lyrics = (await (0, cloudinary_file_1.uploadFile)(lyricsFile, '/lyrics', (0, utils_1.createId)()));
                }
                else {
                    await (0, cloudinary_file_1.uploadFile)(lyricsFile, '/lyrics', (0, cloudinary_file_1.extractPublicId)(findSong.lyricsFile));
                }
            }
            if (thumbnailFile) {
                if (audioFile) {
                    // if the user uploaded a thumbnail file, embed it into the audio file's metadata
                    node_id3_1.default.update({
                        title,
                        releaseTime: releaseDate,
                        ...(findArtists.length > 0 && { artist: findArtists.map(a => a.name).join("/") }),
                        originalReleaseTime: releaseDate,
                        ...(releaseDate && { year: new Date(releaseDate).getFullYear().toString() }),
                        ...(releaseDate && { originalYear: new Date(releaseDate).getFullYear().toString() }),
                        image: {
                            mime: thumbnailFile.mimetype,
                            type: { id: 3, name: 'front cover' },
                            description: 'Cover Art',
                            imageBuffer: node_fs_1.default.readFileSync(thumbnailFile.path)
                        }
                    }, audioFile.path);
                }
                else {
                }
                if (findSong.thumbnail.includes('/assets/')) {
                    thumbnail = (await (0, cloudinary_file_1.uploadFile)(thumbnailFile, '/cover', (0, utils_1.createId)()));
                }
                else {
                    await (0, cloudinary_file_1.uploadFile)(thumbnailFile, '/cover', (0, cloudinary_file_1.extractPublicId)(findSong.thumbnail));
                }
            }
            else {
                const picture = metadata?.common.picture?.[0];
                if (picture) {
                    const coverPath = `uploads/${Date.now() + '-' + Math.round(Math.random() * 1e9)}.${picture.format.split('/')[1]}`;
                    node_fs_1.default.writeFileSync(coverPath, Buffer.from(picture.data));
                    const coverFile = {
                        path: coverPath,
                        mimetype: picture.format,
                        originalname: `cover.${picture.format.split('/')[1]}`
                    };
                    await (0, cloudinary_file_1.uploadFile)(coverFile, '/cover', (0, cloudinary_file_1.extractPublicId)(findSong.thumbnail));
                }
            }
            // upload audio file to cloud storage and get the url
            if (audioFile) {
                await (0, cloudinary_file_1.uploadFile)(audioFile, '/audio', (0, cloudinary_file_1.extractPublicId)(findSong.stream));
            }
            const song = {
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
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
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
                throw new exceptions_1.NotFoundException('Song not found');
            return response.json({ message: 'Song fetched successfully', data });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async deleteSong(request, response) {
        try {
            const findSong = await db_1.db.query.songs.findFirst({
                where: (0, db_1.eq)(schemas_1.songs.id, request.params.id),
                columns: { stream: true, lyricsFile: true, thumbnail: true }
            });
            if (!findSong)
                throw new exceptions_1.NotFoundException('Song not found');
            const deleteUrls = [
                (0, cloudinary_file_1.extractPublicId)(findSong.stream),
                ...(findSong.lyricsFile ? [(0, cloudinary_file_1.extractPublicId)(findSong.lyricsFile)] : []),
                ...(findSong.thumbnail && !findSong.thumbnail.includes('/assets/') ? [(0, cloudinary_file_1.extractPublicId)(findSong.thumbnail)] : [])
            ];
            await (0, cloudinary_file_1.deleteFile)(deleteUrls);
            await db_1.db.delete(schemas_1.songs).where((0, db_1.eq)(schemas_1.songs.id, request.params.id));
            return response.json({ message: 'Song deleted successfully' });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
}
exports.SongService = SongService;
