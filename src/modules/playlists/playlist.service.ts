import { Request } from "express"
import { db } from "../../db"
import { PlayList } from "./playlist.model"
import { playlists } from "../../db/schemas"

export class PlaylistService {
    public async getPlaylists(request: Request) {
        try {
            const songs = await db.query.playlists.findMany({
                columns: { userId: false },
                with: {
                    user: true,
                    artists: {
                        columns: { id: false, artistId: false, playlistId: false },
                        with: { artist: true }
                    },
                    songs: {
                        columns: { id: false, songId: false, playlistId: false },
                        with: { song: { columns: { userId: false } } }
                    }
                }
            }).then(result => result.map(playlist => ({
                ...playlist,
                artists: playlist.artists.map(a => a.artist),
                songs: playlist.songs.map(s => s.song)
            })))
            return songs
        } catch (error) {
            throw new Error(String(error))
        }
    }

    public async createPlaylist(request: Request) {
        try {
            const song = request.body as PlayList
            const users = await db.insert(playlists).values(song);
            return users
        } catch (error) {
            throw new Error(String(error))
        }
    }

}
