import { Request, Response } from "express"
import { and, db, eq, inArray } from "../../db"
import { CreatePlayList, PlayList } from "./playlist.model"
import { playlistArtists, playlists, playlistSongs, songs } from "../../db/schemas"
import { BadRequestException, HttpException } from "../../lib/exceptions"
import { CreatePlaylistDto } from "./dto/create-playlist.dto"
import { uploadFile } from "../../lib/helpers/upload-file"
import { UpdatePlaylistDto } from "./dto/update-playlist.dto"

export class PlaylistService {
    public async getPlaylists(request: Request, response: Response) {
        try {
            const { } = request.query
            // Query with proper typing - don't exclude userId since Song type expects it
            const queryResult = await db.query.playlists.findMany({
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
            })
            const data: PlayList[] = queryResult.map(playlist => ({
                ...playlist,
                user: playlist.user,
                // artists: playlist.artists.map(a => a.artist),
                songs: playlist.songs.map(s => s.song)
            }))
            return response.json({ message: 'Playlists fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async createPlaylist(request: Request, response: Response) {
        try {
            const { releaseDate, title, songIds, description } = request.body as CreatePlaylistDto
            let thumbnailUrl: string | null = null
            const thumbnailFile: Express.Multer.File | null = request.file ?? null
            if (thumbnailFile) {
                thumbnailUrl = (await uploadFile(thumbnailFile.path, 'thumbnails')) as string
            }
            // get all the songs by their ids
            const chosenSongs = await db.query.songs.findMany({
                columns: { id: true, duration: true },
                where: inArray(songs.id, songIds),
                with: {
                    artists: {
                        columns: { id: false, songId: false, artistId: false },
                        with: { artist: { columns: { id: true, name: true } } }
                    }
                }
            }).then(results => results.map(song => ({
                ...song,
                artists: song.artists.map(a => a.artist)
            })))
            const totalDuration = chosenSongs.reduce((total, song) => total + song.duration, 0)
            // get unique artist ids from chosen songs
            const artistIds = Array.from(new Set(chosenSongs.flatMap(song => song.artists.map(a => a?.id))))
            const playlist = {
                releaseDate, title, description,
                userId: request.userId,
                thumbnail: thumbnailUrl ?? '/assets/default-playlist-thumbnail.png',
                totalDuration,
                artistNames: Array.from(new Set(chosenSongs.flatMap(song => song.artists.map(a => a?.name)))).join(', ')
            } as CreatePlayList
            const insertedPlaylist = await db.insert(playlists).values(playlist)
            await db.insert(playlistSongs).values(chosenSongs.map(song => ({ songId: song.id, playlistId: insertedPlaylist[0].insertId })))
            await db.insert(playlistArtists).values(artistIds.map(artistId => ({ artistId, playlistId: insertedPlaylist[0].insertId })))
            return response.status(201).json({ message: 'Playlists created successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async updatePlaylist(request: Request, response: Response) {
        try {
            const { id } = request.params
            const { releaseDate, title, songIds, description } = request.body as UpdatePlaylistDto
            let thumbnailUrl: string | null = null
            const thumbnailFile: Express.Multer.File | null = request.file ?? null
            if (thumbnailFile) {
                thumbnailUrl = (await uploadFile(thumbnailFile.path, 'thumbnails')) as string
            }
            const myPlaylist = await db.query.playlists.findFirst({
                where: eq(playlists.id, parseInt(id)),
                with: {
                    // artists: {
                    //     columns: { id: false, artistId: false, playlistId: false },
                    //     with: { artist: true }
                    // },
                    songs: {
                        columns: { id: false },
                        // with: { song: true }
                    }
                }
            })
            // .then(playlist => ({
            //     ...playlist,
            //     songs: playlist?.songs.map(s => s.song)
            // }))
            if (!myPlaylist) throw new BadRequestException('Playlist not found')
            // return response.json({ message: 'Playlist fetched', data: myPlaylist })
            // const currentPlaylistSongs = await db.query.playlistSongs.findMany({
            //     where: eq(playlistSongs.playlistId, parseInt(id)),
            //     columns: { songId: true }
            // })
            const currentPlaylistSongIds = myPlaylist.songs.map(ps => ps.songId)
            // the user can remove any song in the playlist or add new songs
            const songsToAdd = songIds.filter(songId => !currentPlaylistSongIds.includes(songId))
            const songsToRemove = currentPlaylistSongIds.filter(songId => !songIds.includes(songId))
            // if (songsToAdd.length > 0) {
            //     await db.insert(playlistSongs).values(songsToAdd.map(song => ({ songId: song, playlistId: parseInt(id) })))
            // }
            // if (songsToRemove.length > 0) {
            //     await db.delete(playlistSongs).where(and(eq(playlistSongs.playlistId, parseInt(id)), inArray(playlistSongs.songId, songsToRemove)))
            // }
            if (songsToAdd.length > 0 || songsToRemove.length > 0) {
                const updatedPlaylistSongs = await db.query.songs.findMany({
                    columns: { duration: true },
                    where: inArray(songs.id, songIds)
                })
                const totalDuration = updatedPlaylistSongs.reduce((total, song) => total + song.duration, 0)
            }

            const playlist = {
                releaseDate, title, description,
                userId: request.userId,
                thumbnail: thumbnailUrl ?? '/assets/default-playlist-thumbnail.png',
                // totalDuration,
                // artistNames: Array.from(new Set(chosenSongs.flatMap(song => song.artists.map(a => a?.name)))).join(', ')
            } as PlayList
            // const insertedPlaylist = await db.insert(playlists).values(playlist)
            // await db.insert(playlistSongs).values(chosenSongs.map(song => ({ songId: song.id, playlistId: insertedPlaylist[0].insertId })))
            // await db.insert(playlistArtists).values(artistIds.map(artistId => ({ artistId, playlistId: insertedPlaylist[0].insertId })))
            return response.json({ songsToAdd, songsToRemove })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}