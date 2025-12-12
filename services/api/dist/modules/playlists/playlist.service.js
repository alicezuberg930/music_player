"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistService = void 0;
const db_1 = require("@yukikaze/db");
const schemas_1 = require("@yukikaze/db/schemas");
const exceptions_1 = require("../../lib/exceptions");
const cloudinary_file_1 = require("../../lib/helpers/cloudinary.file");
const create_cuid_1 = require("@yukikaze/lib/create-cuid");
class PlaylistService {
    async getPlaylists(request, response) {
        try {
            // const { artistName, songTitle, title, releaseDate } = request.query
            const userId = request.userId; // Get user ID from JWT middleware (undefined if not logged in)
            const data = await db_1.db.query.playlists.findMany({
                with: {
                    user: { columns: { password: false, email: false } },
                    // artists: {
                    //     columns: { id: false, artistId: false, playlistId: false },
                    //     with: { artist: true }
                    // },
                    songs: {
                        columns: { id: false, songId: false, playlistId: false },
                        with: { song: true } // Include all song columns to match Song type
                    }
                }
            }).then(results => results.map(playlist => ({
                ...playlist,
                // artists: playlist.artists.map(a => a.artist),
                songs: playlist.songs.map(s => s.song)
            })));
            // If user is logged in, check which playlists they've liked
            let likedPlaylistIds = new Set();
            if (userId) {
                const playlistIds = data.map(playlist => playlist.id);
                const likedPlaylists = await db_1.db.query.userFavoritePlaylists.findMany({
                    where: (0, db_1.and)((0, db_1.eq)(schemas_1.userFavoritePlaylists.userId, userId), (0, db_1.inArray)(schemas_1.userFavoritePlaylists.playlistId, playlistIds)),
                    columns: { playlistId: true }
                });
                likedPlaylistIds = new Set(likedPlaylists.map(lp => lp.playlistId));
            }
            const playlistsWithLikedStatus = data.map(playlist => ({
                ...playlist,
                liked: likedPlaylistIds.has(playlist.id)
            }));
            return response.json({ message: 'Playlists fetched successfully', data: playlistsWithLikedStatus });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async createPlaylist(request, response) {
        try {
            const { releaseDate, title, description } = request.body;
            let thumbnailUrl = null;
            const files = request.files;
            const thumbnailFile = files['thumbnail']?.[0] ?? null;
            if (thumbnailFile) {
                thumbnailUrl = (await (0, cloudinary_file_1.uploadFile)(thumbnailFile, '/playlist', (0, create_cuid_1.createId)()));
            }
            const playlist = {
                releaseDate, title, description,
                userId: request.userId,
                thumbnail: thumbnailUrl ?? '/assets/default/default-playlist-thumbnail.png',
                artistNames: ''
            };
            await db_1.db.insert(schemas_1.playlists).values(playlist);
            return response.status(201).json({ message: 'Playlists created successfully' });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async updatePlaylist(request, response) {
        try {
            const { id } = request.params;
            const myPlaylist = await db_1.db.query.playlists.findFirst({
                columns: { totalDuration: true, thumbnail: true },
                where: (0, db_1.eq)(schemas_1.playlists.id, id),
                with: { artists: true, songs: true }
            });
            if (!myPlaylist)
                throw new exceptions_1.BadRequestException('Playlist not found');
            const { releaseDate, title, songIds, description } = request.body;
            const files = request.files;
            const thumbnailFile = files['thumbnail']?.[0] ?? null;
            let thumbnail = null;
            if (thumbnailFile) {
                if (myPlaylist.thumbnail.includes('/assets/')) {
                    thumbnail = (await (0, cloudinary_file_1.uploadFile)(thumbnailFile, '/playlist', (0, create_cuid_1.createId)()));
                }
                else {
                    await (0, cloudinary_file_1.uploadFile)(thumbnailFile, '/playlist', (0, cloudinary_file_1.extractPublicId)(myPlaylist.thumbnail));
                }
            }
            const currentPlaylistSongIds = myPlaylist.songs.map(ps => ps.songId);
            // let totalDuration = myPlaylist.totalDuration!
            // // the user can remove any song in the playlist or add new songs
            // const songsToAdd = songIds.filter(songId => !currentPlaylistSongIds.includes(songId))
            // const songsToRemove = currentPlaylistSongIds.filter(songId => !songIds.includes(songId))
            // if (songsToAdd.length > 0) {
            //     await db.insert(playlistSongs).values(songsToAdd.map(song => ({ songId: song, playlistId: id })))
            //     const addSongs = await db.query.songs.findMany({ columns: { duration: true }, where: inArray(songs.id, songsToAdd) })
            //     totalDuration += addSongs.reduce((total, song) => total + song.duration, 0)
            //     console.log('added')
            // }
            // if (songsToRemove.length > 0) {
            //     await db.delete(playlistSongs).where(and(eq(playlistSongs.playlistId, id), inArray(playlistSongs.songId, songsToRemove)))
            //     const removeSongs = await db.query.songs.findMany({ columns: { duration: true }, where: inArray(songs.id, songsToRemove) })
            //     totalDuration -= removeSongs.reduce((total, song) => total + song.duration, 0)
            //     console.log('deleted')
            // }
            // const updatedArtists = await db.query.playlistSongs.findMany({
            //     where: eq(playlistSongs.playlistId, id),
            //     columns: {},
            //     with: { song: { columns: { artistNames: true } } }
            // }).then(results => Array.from(new Set(results?.flatMap(ps => ps.song.artistNames?.split(', ') ?? []))))
            const playlist = {
                releaseDate, title, description,
                userId: request.userId,
                ...thumbnail && { thumbnail }
            };
            await db_1.db.update(schemas_1.playlists).set(playlist).where((0, db_1.eq)(schemas_1.playlists.id, id));
            return response.json({ message: 'Playlists updated successfully' });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async findPlaylist(request, response) {
        try {
            const { id } = request.params;
            const data = await db_1.db.query.playlists.findFirst({
                where: (0, db_1.eq)(schemas_1.playlists.id, id),
                with: {
                    user: { columns: { password: false, email: false } },
                    songs: {
                        columns: { id: false, songId: false, playlistId: false },
                        with: { song: true }
                    },
                    artists: {
                        columns: { id: false, artistId: false, playlistId: false },
                        with: { artist: true }
                    }
                }
            }).then(playlist => playlist ? ({
                ...playlist,
                songs: playlist.songs.map(s => s.song),
                artists: playlist.artists.map(a => a.artist)
            }) : undefined);
            if (!data)
                throw new exceptions_1.NotFoundException('Playlist not found');
            return response.json({ message: 'Playlist details fetched successfully', data });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async deletePlaylist(request, response) {
        try {
            const { id } = request.params;
            const myPlaylist = await db_1.db.query.playlists.findFirst({
                columns: { thumbnail: true },
                where: (0, db_1.eq)(schemas_1.playlists.id, id)
            });
            if (!myPlaylist)
                throw new exceptions_1.BadRequestException('Playlist not found');
            if (!myPlaylist.thumbnail.includes('/assets/')) {
                await (0, cloudinary_file_1.deleteFile)((0, cloudinary_file_1.extractPublicId)(myPlaylist.thumbnail));
            }
            await db_1.db.delete(schemas_1.playlists).where((0, db_1.eq)(schemas_1.playlists.id, id));
            return response.json({ message: 'Playlist deleted successfully' });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async addSongs(request, response) {
        const { id } = request.params;
        const myPlaylist = await db_1.db.query.playlists.findFirst({
            columns: { totalDuration: true, thumbnail: true },
            with: { songs: true },
            where: (0, db_1.eq)(schemas_1.playlists.id, id)
        });
        if (!myPlaylist)
            throw new exceptions_1.BadRequestException('Playlist not found');
        const { songIds } = request.body;
        // get existing song ids in the playlist
        const existingSongIds = new Set(myPlaylist.songs.map(ps => ps.songId));
        // filter out songs that already exist in the playlist
        const newSongIds = songIds.filter(songId => !existingSongIds.has(songId));
        // if no new songs to add, return early
        if (newSongIds.length === 0) {
            throw new exceptions_1.BadRequestException('All songs already exist in the playlist');
        }
        // get all the songs by their ids
        const songsToAdd = await db_1.db.query.songs.findMany({
            columns: { id: true, duration: true },
            where: (0, db_1.inArray)(schemas_1.songs.id, newSongIds),
            with: {
                artists: {
                    columns: { id: false, songId: false, artistId: false },
                    with: { artist: { columns: { id: true, name: true } } }
                }
            }
        }).then(results => results?.map(song => ({
            ...song,
            artists: song.artists.map(a => a.artist)
        })));
        const totalDuration = myPlaylist.totalDuration + songsToAdd.reduce((total, song) => total + song.duration, 0);
        // get unique artist ids from chosen songs 
        const artistIds = Array.from(new Set(songsToAdd.flatMap(song => song.artists.map(a => a?.id))));
        // get existing artist ids in the playlist
        const existingArtistIds = await db_1.db.query.playlistArtists.findMany({
            columns: { artistId: true },
            where: (0, db_1.eq)(schemas_1.playlistArtists.playlistId, id)
        }).then(results => new Set(results.map(pa => pa.artistId)));
        // filter out artists that already exist in the playlist
        const newArtistIds = artistIds.filter(artistId => !existingArtistIds.has(artistId));
        const playlist = {
            totalDuration,
        };
        await db_1.db.update(schemas_1.playlists).set(playlist).where((0, db_1.eq)(schemas_1.playlists.id, id));
        await db_1.db.insert(schemas_1.playlistSongs).values(songsToAdd.map(song => ({ songId: song.id, playlistId: id })));
        if (newArtistIds.length > 0) {
            await db_1.db.insert(schemas_1.playlistArtists).values(newArtistIds.map(artistId => ({ artistId, playlistId: id })));
        }
        return response.json({ message: 'Song added successfully' });
    }
    async removeSongs(request, response) {
        const { id } = request.params;
        const myPlaylist = await db_1.db.query.playlists.findFirst({
            columns: { totalDuration: true },
            with: { songs: true },
            where: (0, db_1.eq)(schemas_1.playlists.id, id)
        });
        if (!myPlaylist)
            throw new exceptions_1.BadRequestException('Playlist not found');
        const { songIds } = request.body;
        // get existing song ids in the playlist
        const existingSongIds = new Set(myPlaylist.songs.map(ps => ps.songId));
        // filter only songs that actually exist in the playlist
        const songsToRemove = songIds.filter(songId => existingSongIds.has(songId));
        // if no songs to remove, return early
        if (songsToRemove.length === 0) {
            throw new exceptions_1.BadRequestException('No songs to remove from the playlist');
        }
        // get all the songs by their ids to calculate duration
        const removedSongs = await db_1.db.query.songs.findMany({
            columns: { id: true, duration: true },
            where: (0, db_1.inArray)(schemas_1.songs.id, songsToRemove),
            with: {
                artists: {
                    columns: { id: false, songId: false, artistId: false },
                    with: { artist: { columns: { id: true, name: true } } }
                }
            }
        }).then(results => results?.map(song => ({
            ...song,
            artists: song.artists.map(a => a.artist)
        })));
        const totalDuration = myPlaylist.totalDuration - removedSongs.reduce((total, song) => total + song.duration, 0);
        // get unique artist ids from removed songs
        const removedArtistIds = Array.from(new Set(removedSongs.flatMap(song => song.artists.map(a => a?.id))));
        // get remaining songs in playlist after removal
        const remainingSongs = await db_1.db.query.playlistSongs.findMany({
            where: (0, db_1.and)((0, db_1.eq)(schemas_1.playlistSongs.playlistId, id), (0, db_1.inArray)(schemas_1.playlistSongs.songId, Array.from(existingSongIds).filter(sid => !songsToRemove.includes(sid)))),
            with: {
                song: {
                    with: {
                        artists: {
                            columns: { artistId: true }
                        }
                    }
                }
            }
        });
        // get artist ids that still exist in remaining songs
        const remainingArtistIds = new Set(remainingSongs.flatMap(ps => ps.song.artists.map(a => a.artistId)));
        // find artists to remove (artists that were in removed songs but not in remaining songs)
        const artistsToRemove = removedArtistIds.filter(artistId => !remainingArtistIds.has(artistId));
        // delete songs from playlist
        await db_1.db.delete(schemas_1.playlistSongs).where((0, db_1.and)((0, db_1.eq)(schemas_1.playlistSongs.playlistId, id), (0, db_1.inArray)(schemas_1.playlistSongs.songId, songsToRemove)));
        // delete artists that no longer have songs in the playlist
        if (artistsToRemove.length > 0) {
            await db_1.db.delete(schemas_1.playlistArtists).where((0, db_1.and)((0, db_1.eq)(schemas_1.playlistArtists.playlistId, id), (0, db_1.inArray)(schemas_1.playlistArtists.artistId, artistsToRemove)));
        }
        const playlist = {
            totalDuration,
        };
        await db_1.db.update(schemas_1.playlists).set(playlist).where((0, db_1.eq)(schemas_1.playlists.id, id));
        return response.json({ message: 'Songs removed successfully' });
    }
}
exports.PlaylistService = PlaylistService;
