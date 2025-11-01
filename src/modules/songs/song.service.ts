import { Request } from "express"
import { db } from "../../db"
import { Song } from "./song.model"
import { songs } from "../../db/schemas/song.schema"

export class SongService {
    public async getSongs(request: Request) {
        try {
            const songs = await db.query.songs.findMany({
                columns: { userId: false },
                with: {
                    user: true,
                    genres: {
                        with: { genre: true }
                    },
                    artists: {
                        columns: { id: false, artistId: false, songId: false },
                        with: { artist: true }
                    }
                }
            }).then(result => result.map(song => ({
                ...song,
                artists: song.artists.map(a => a.artist)
            })))
            return songs
        } catch (error) {
            throw new Error(String(error))
        }
    }

    public async createSong(request: Request) {
        try {
            const song = request.body as Song
            const users = await db.insert(songs).values(song);
            return users
        } catch (error) {
            throw new Error(String(error))
        }
    }

}
