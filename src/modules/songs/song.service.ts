import { Request, Response } from "express"
import { db, eq } from "../../db"
import { Song } from "./song.model"
import { songs } from "../../db/schemas/song.schema"
import { BadRequestException, NotFoundException } from "../../lib/exceptions"
import { HttpException } from "../../lib/exceptions/HttpException"

export class SongService {
    public async getSongs(request: Request, response: Response) {
        const hello = request.query as unknown as { a: number, b: number, c: number }
        console.log((typeof hello.a))
        try {
            const songs = await db.query.songs.findMany({
                columns: { userId: false },
                with: {
                    user: true,
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
            })))
            return response.json({
                message: 'Song list fetched successfully',
                data: songs
            })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async createSong(request: Request, response: Response) {
        try {
            const files = request.files as {
                [fieldname: string]: Express.Multer.File[];
            };
            return response.json({ request: files.stream[0] })
            // const songBody = request.body as Song
            // const song = await db.insert(songs).values(songBody)
            // console.log(song[0])
            // console.log(song[1])
            // return response.json({ message: 'Song created successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async updateSong(request: Request, response: Response) {
        try {
            const { id } = request.params
            const songBody = request.body as Song
            const song = await db.update(songs).set(songBody).where(eq(songs.id, parseInt(id)))
            console.log(song[0])
            console.log(song[1])
            return response.json({ message: 'Song updated successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async findSong(request: Request, response: Response) {
        try {
            const { id } = request.params
            const song = await db.query.songs.findFirst({
                where: eq(songs.id, parseInt(id)),
                columns: { userId: false },
                with: {
                    user: true,
                    genres: {
                        columns: { id: false, genreId: false, songId: false },
                        with: { genre: true }
                    },
                    artists: {
                        columns: { id: false, artistId: false, songId: false },
                        with: { artist: true }
                    }
                }
            })
            if (!song) throw new NotFoundException('Song not found')
            return response.json({
                ...song,
                artists: song.artists.map(a => a.artist),
                genres: song.genres.map(g => g.genre)
            })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}