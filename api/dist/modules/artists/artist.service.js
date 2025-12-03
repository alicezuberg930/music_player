"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistService = void 0;
const db_1 = require("../../db");
const schemas_1 = require("../../db/schemas");
const exceptions_1 = require("../../lib/exceptions");
const cloudinary_file_1 = require("../../lib/helpers/cloudinary.file");
const utils_1 = require("../../db/utils");
class ArtistService {
    async getArtists(request, response) {
        try {
            const {} = request.query;
            const data = await db_1.db.query.artists.findMany({
                with: {
                    songs: {
                        columns: { id: false, artistId: false, songId: false },
                        with: { song: true }
                    }
                }
            }).then(result => result.map(artist => ({
                ...artist,
                songs: artist.songs?.map(s => s?.song)
            })));
            return response.json({ message: 'Artists fetched successfully', data });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async createArtist(request, response) {
        try {
            const { name } = request.body;
            let thumbnailUrl = null;
            const files = request.files;
            const thumbnailFile = files['thumbnail']?.[0] ?? null;
            if (thumbnailFile) {
                thumbnailUrl = (await (0, cloudinary_file_1.uploadFile)(thumbnailFile, '/avatar', (0, utils_1.createId)()));
            }
            const artist = {
                name,
                thumbnail: thumbnailUrl ?? '/assets/default/default-artist-avatar.png'
            };
            await db_1.db.insert(schemas_1.artists).values(artist);
            return response.status(201).json({ message: 'Artist created successfully', data: artist });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async updateArtist(request, response) {
        try {
            const { id } = request.params;
            const findArtist = await db_1.db.query.artists.findFirst({ where: (0, db_1.eq)(schemas_1.artists.id, id), columns: { thumbnail: true } });
            if (!findArtist)
                throw new exceptions_1.NotFoundException('Artist not found');
            const { name } = request.body;
            let thumbnailUrl = null;
            const files = request.files;
            const thumbnailFile = files['thumbnail']?.[0] ?? null;
            if (thumbnailFile) {
                if (findArtist.thumbnail.includes('/assets/')) {
                    thumbnailUrl = (await (0, cloudinary_file_1.uploadFile)(thumbnailFile, '/avatar', (0, utils_1.createId)()));
                }
                else {
                    await (0, cloudinary_file_1.uploadFile)(thumbnailFile, '/avatar', (0, cloudinary_file_1.extractPublicId)(findArtist.thumbnail));
                }
            }
            const artist = {
                ...name && { name },
                ...thumbnailUrl && { thumbnail: thumbnailUrl }
            };
            if (Object.entries(artist).length > 0)
                await db_1.db.update(schemas_1.artists).set(artist).where((0, db_1.eq)(schemas_1.artists.id, id));
            return response.json({ message: 'Artist updated successfully' });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async findArtist(request, response) {
        try {
            const { id } = request.params;
            const data = await db_1.db.query.artists.findFirst({
                where: (0, db_1.eq)(schemas_1.artists.id, id),
                with: {
                    songs: {
                        columns: { id: false, artistId: false, songId: false },
                        with: { song: true }
                    },
                    playlists: {
                        columns: { id: false, artistId: false, playlistId: false },
                        with: { playlist: true }
                    }
                }
            }).then(artist => artist ? ({
                ...artist,
                songs: artist.songs.map(s => s.song),
                playlists: artist.playlists.map(p => p.playlist)
            }) : undefined);
            if (!data)
                throw new exceptions_1.NotFoundException('Artist not found');
            return response.json({ message: 'Artist details fetched successfully', data });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
}
exports.ArtistService = ArtistService;
