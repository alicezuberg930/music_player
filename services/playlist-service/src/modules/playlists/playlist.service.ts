import { Request, Response } from "express"
import { and, db, eq, inArray } from "@yukikaze/db"
import { CreatePlayList, PlayList } from "./playlist.model"
import { playlistArtists, playlists, playlistSongs, songs, userFavoritePlaylists } from "@yukikaze/db/schemas"
import { BadRequestException, HttpException, NotFoundException } from "@yukikaze/lib/exception"
import { deleteFile, extractPublicId, uploadFile } from "@yukikaze/lib/cloudinary"
import { createId } from "@yukikaze/lib/create-cuid"
import { resizeImageToBuffer } from "@yukikaze/lib/image-resize"
import fs from "node:fs"
import { PlaylistValidators } from "@yukikaze/validator"

export class PlaylistService {
    public async getPlaylists(request: Request<{}, {}, {}, PlaylistValidators.QueryPlaylistParams>, response: Response) {
        try {
            // const { artistName, songTitle, title, releaseDate } = request.query
            const userId = request.userId // Get user ID from JWT middleware (undefined if not logged in)
            const data = await db.query.playlists.findMany({
                with: {
                    user: { columns: { password: false, email: false } },
                    // artists: {
                    //     columns: { id: false, artistId: false, playlistId: false },
                    //     with: { artist: true }
                    // },
                    songs: {
                        columns: { id: false, songId: false, playlistId: false },
                        with: { song: true }  // Include all song columns to match Song type
                    }
                }
            }).then(results => results.map(playlist => ({
                ...playlist,
                // artists: playlist.artists.map(a => a.artist),
                songs: playlist.songs.map(s => s.song)
            })))
            // If user is logged in, check which playlists they've liked
            let likedPlaylistIds: Set<string> = new Set()
            if (userId) {
                const playlistIds = data.map(playlist => playlist.id)
                const likedPlaylists = await db.query.userFavoritePlaylists.findMany({
                    where: and(
                        eq(userFavoritePlaylists.userId, userId),
                        inArray(userFavoritePlaylists.playlistId, playlistIds)
                    ),
                    columns: { playlistId: true }
                })
                likedPlaylistIds = new Set(likedPlaylists.map(lp => lp.playlistId))
            }
            const playlistsWithLikedStatus = data.map(playlist => ({
                ...playlist,
                liked: likedPlaylistIds.has(playlist.id)
            }))
            return response.json({ message: 'Playlists fetched successfully', data: playlistsWithLikedStatus })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async createPlaylist(request: Request<{}, {}, PlaylistValidators.CreatePlaylistInput>, response: Response) {
        try {
            const { releaseDate, title, description } = request.body
            // let thumbnailUrl: string | null = null
            // const files = request.files as { [fieldname: string]: Express.Multer.File[] }
            // const thumbnailFile: Express.Multer.File | null = files['thumbnail']?.[0] ?? null
            // if (thumbnailFile) {
            //     // Read file into buffer first to release file handle
            //     const originalBuffer = fs.readFileSync(thumbnailFile.path)
            //     // Resize image from buffer
            //     const resizedBuffer = await resizeImageToBuffer(originalBuffer, {
            //         height: 600, width: 600,
            //         aspectRatio: '1:1',
            //         fit: 'cover',
            //     })
            //     fs.writeFileSync(thumbnailFile.path, resizedBuffer)
            //     thumbnailUrl = (await uploadFile({ files: thumbnailFile, subFolder: '/playlist', publicId: createId() })) as string
            // }
            const playlist = {
                releaseDate, title, description,
                userId: request.userId,
                thumbnail: '/assets/default/default-playlist-thumbnail.png',
                artistNames: ''
            } as CreatePlayList
            await db.insert(playlists).values(playlist)
            return response.status(201).json({ message: 'Playlists created successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async updatePlaylist(request: Request<{ id: string }, {}, PlaylistValidators.UpdatePlaylistInput>, response: Response) {
        try {
            const { id } = request.params
            const myPlaylist = await db.query.playlists.findFirst({
                columns: { totalDuration: true, thumbnail: true },
                where: eq(playlists.id, id),
                with: { artists: true, songs: true }
            })
            if (!myPlaylist) throw new BadRequestException('Playlist not found')
            const { releaseDate, title, songIds, description } = request.body
            const files = request.files as { [fieldname: string]: Express.Multer.File[] }
            const thumbnailFile: Express.Multer.File | null = files['thumbnail']?.[0] ?? null
            let thumbnail: string | null = null
            if (thumbnailFile) {
                // Read file into buffer first to release file handle
                const originalBuffer = fs.readFileSync(thumbnailFile.path)
                // Resize image from buffer
                const resizedBuffer = await resizeImageToBuffer(originalBuffer, {
                    height: 600, width: 600,
                    aspectRatio: '1:1',
                    fit: 'cover',
                })
                fs.writeFileSync(thumbnailFile.path, resizedBuffer)
                if (myPlaylist.thumbnail.includes('/assets/')) {
                    thumbnail = (await uploadFile({ files: thumbnailFile, subFolder: '/playlist', publicId: createId() })) as string
                } else {
                    await uploadFile({ files: thumbnailFile, publicId: extractPublicId(myPlaylist.thumbnail) })
                }
            }
            // const currentPlaylistSongIds = myPlaylist.songs.map(ps => ps.songId)
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
            } as PlayList
            await db.update(playlists).set(playlist).where(eq(playlists.id, id))
            return response.json({ message: 'Playlists updated successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async findPlaylist(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const data: PlayList | undefined = await db.query.playlists.findFirst({
                where: eq(playlists.id, id),
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
            }) : undefined)
            if (!data) throw new NotFoundException('Playlist not found')
            return response.json({ message: 'Playlist details fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async deletePlaylist(request: Request<{ id: string }, {}>, response: Response) {
        try {
            const { id } = request.params
            const myPlaylist = await db.query.playlists.findFirst({
                columns: { thumbnail: true },
                where: eq(playlists.id, id)
            })
            if (!myPlaylist) throw new BadRequestException('Playlist not found')
            if (!myPlaylist.thumbnail.includes('/assets/')) {
                await deleteFile(extractPublicId(myPlaylist.thumbnail))
            }
            // delete all song in playlist_songs
            await db.delete(playlistSongs).where(eq(playlistSongs.playlistId, id))
            // delete all artists in playlist_artists
            await db.delete(playlistArtists).where(eq(playlistArtists.playlistId, id))
            // finally delete playlist
            await db.delete(playlists).where(eq(playlists.id, id))
            return response.json({ message: 'Playlist deleted successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async addSongs(request: Request<{ id: string }, {}, PlaylistValidators.AddSongsInput>, response: Response) {
        const { id } = request.params
        const myPlaylist = await db.query.playlists.findFirst({
            columns: { totalDuration: true, thumbnail: true },
            with: { songs: true },
            where: eq(playlists.id, id)
        })
        if (!myPlaylist) throw new BadRequestException('Playlist not found')
        const { songIds } = request.body;

        // get existing song ids in the playlist
        const existingSongIds = new Set(myPlaylist.songs.map(ps => ps.songId))

        // filter out songs that already exist in the playlist
        const newSongIds = songIds.filter(songId => !existingSongIds.has(songId))

        // if no new songs to add, return early
        if (newSongIds.length === 0) {
            throw new BadRequestException('All songs already exist in the playlist')
        }

        // get all the songs by their ids
        const songsToAdd = await db.query.songs.findMany({
            columns: { id: true, duration: true },
            where: inArray(songs.id, newSongIds),
            with: {
                artists: {
                    columns: { id: false, songId: false, artistId: false },
                    with: { artist: { columns: { id: true, name: true } } }
                }
            }
        }).then(results => results?.map(song => ({
            ...song,
            artists: song.artists.map(a => a.artist)
        })))
        const totalDuration = myPlaylist.totalDuration! + songsToAdd.reduce((total, song) => total + song.duration, 0)
        // get unique artist ids from chosen songs 
        const artistIds = Array.from(new Set(songsToAdd.flatMap(song => song.artists.map(a => a?.id))))

        // get existing artist ids in the playlist
        const existingArtistIds = await db.query.playlistArtists.findMany({
            columns: { artistId: true },
            where: eq(playlistArtists.playlistId, id)
        }).then(results => new Set(results.map(pa => pa.artistId)))

        // filter out artists that already exist in the playlist
        const newArtistIds = artistIds.filter(artistId => !existingArtistIds.has(artistId))

        const playlist = {
            totalDuration,
        } as CreatePlayList
        await db.update(playlists).set(playlist).where(eq(playlists.id, id))
        await db.insert(playlistSongs).values(songsToAdd.map(song => ({ songId: song.id, playlistId: id })))
        if (newArtistIds.length > 0) {
            await db.insert(playlistArtists).values(newArtistIds.map(artistId => ({ artistId, playlistId: id })))
        }
        return response.json({ message: 'Song added successfully' })
    }

    public async removeSongs(request: Request<{ id: string }, {}, PlaylistValidators.RemoveSongsInput>, response: Response) {
        const { id } = request.params
        const myPlaylist = await db.query.playlists.findFirst({
            columns: { totalDuration: true },
            with: { songs: true },
            where: eq(playlists.id, id)
        })
        if (!myPlaylist) throw new BadRequestException('Playlist not found')
        const { songIds } = request.body;

        // get existing song ids in the playlist
        const existingSongIds = new Set(myPlaylist.songs.map(ps => ps.songId))

        // filter only songs that actually exist in the playlist
        const songsToRemove = songIds.filter(songId => existingSongIds.has(songId))

        // if no songs to remove, return early
        if (songsToRemove.length === 0) {
            throw new BadRequestException('No songs to remove from the playlist')
        }

        // get all the songs by their ids to calculate duration
        const removedSongs = await db.query.songs.findMany({
            columns: { id: true, duration: true },
            where: inArray(songs.id, songsToRemove),
            with: {
                artists: {
                    columns: { id: false, songId: false, artistId: false },
                    with: { artist: { columns: { id: true, name: true } } }
                }
            }
        }).then(results => results?.map(song => ({
            ...song,
            artists: song.artists.map(a => a.artist)
        })))

        const totalDuration = myPlaylist.totalDuration! - removedSongs.reduce((total, song) => total + song.duration, 0)

        // get unique artist ids from removed songs
        const removedArtistIds = Array.from(new Set(removedSongs.flatMap(song => song.artists.map(a => a?.id))))

        // get remaining songs in playlist after removal
        const remainingSongs = await db.query.playlistSongs.findMany({
            where: and(
                eq(playlistSongs.playlistId, id),
                inArray(playlistSongs.songId, Array.from(existingSongIds).filter(sid => !songsToRemove.includes(sid)))
            ),
            with: {
                song: {
                    with: {
                        artists: {
                            columns: { artistId: true }
                        }
                    }
                }
            }
        })

        // get artist ids that still exist in remaining songs
        const remainingArtistIds = new Set(remainingSongs.flatMap(ps => ps.song.artists.map(a => a.artistId)))

        // find artists to remove (artists that were in removed songs but not in remaining songs)
        const artistsToRemove = removedArtistIds.filter(artistId => !remainingArtistIds.has(artistId))

        // delete songs from playlist
        await db.delete(playlistSongs).where(
            and(eq(playlistSongs.playlistId, id), inArray(playlistSongs.songId, songsToRemove))
        )

        // delete artists that no longer have songs in the playlist
        if (artistsToRemove.length > 0) {
            await db.delete(playlistArtists).where(
                and(eq(playlistArtists.playlistId, id), inArray(playlistArtists.artistId, artistsToRemove))
            )
        }
        const playlist = {
            totalDuration,
        } as CreatePlayList
        await db.update(playlists).set(playlist).where(eq(playlists.id, id))
        return response.json({ message: 'Songs removed successfully' })
    }
}