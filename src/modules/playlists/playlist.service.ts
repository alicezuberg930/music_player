import { Request, Response } from "express"
import { db, inArray } from "../../db"
import { PlayList } from "./playlist.model"
import { playlistArtists, playlists, playlistSongs, songs } from "../../db/schemas"
import { BadRequestException, HttpException } from "../../lib/exceptions"
import { CreatePlaylistDto } from "./dto/create-playlist.dto"
import { uploadFile } from "../../lib/helpers/upload-file"

export class PlaylistService {
    public async getPlaylists(request: Request, response: Response) {
        try {
            const { } = request.query
            const data: PlayList[] = await db.query.playlists.findMany({
                columns: { userId: false },
                with: {
                    user: { columns: { password: false, email: false } },
                    // artists: {
                    //     columns: { id: false, artistId: false, playlistId: false },
                    //     with: { artist: true }
                    // },
                    songs: {
                        columns: { id: false, songId: false, playlistId: false },
                        with: { song: { columns: { userId: false } } }
                    }
                }
            }).then(result => result.map(playlist => ({
                ...playlist,
                // artists: playlist.artists.map(a => a.artist),
                songs: playlist.songs.map(s => s.song)
            })))
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
            } as PlayList
            const insertedPlaylist = await db.insert(playlists).values(playlist)
            await db.insert(playlistSongs).values(chosenSongs.map(song => ({ songId: song.id, playlistId: insertedPlaylist[0].insertId })))
            await db.insert(playlistArtists).values(artistIds.map(artistId => ({ artistId, playlistId: insertedPlaylist[0].insertId })))
            return response.status(201).json({ message: 'Playlists created successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}