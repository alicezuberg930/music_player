import { Request, Response } from 'express'
import { db, eq, inArray } from '../../db'
import { Song } from './song.model'
import { BadRequestException, NotFoundException } from '../../lib/exceptions'
import { HttpException } from '../../lib/exceptions/HttpException'
import { parseFile } from 'music-metadata'
import fs from 'fs'
import { artists, songs } from '../../db/schemas'
import slugify from '../../lib/helpers/slugify'

export class SongService {
    public async getSongs(request: Request, response: Response) {
        try {
            const songs: Song[] = await db.query.songs.findMany({
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
            let song: Song = { ...request.body }
            const files = request.files as { [fieldname: string]: Express.Multer.File[] }
            const audioFile = files['audio']?.[0]
            const lyricsFile = files['lyrics']?.[0]
            const thumbnailFile = files['thumbnail']?.[0]
            // extract metadata from mp3 file
            const metadata = await parseFile(audioFile.path)

            const picture = metadata.common.picture?.[0]
            let coverBase64: string | null = null
            // save the coverBase64 string to an image file if exists
            if (picture) {
                coverBase64 = `data:${picture.format}base64,${picture.data.toString('base64')}`
                const coverBuffer = Buffer.from(picture!.data)
                const coverPath = `uploads/cover-${Date.now()}.${picture!.format.split('/')[1]}`
                fs.writeFileSync(coverPath, coverBuffer)
            }
            const artistIds = request.body.artistIds as number[]
            const findArtists = await db.query.artists.findMany({
                columns: { name: true },
                where: inArray(artists.id, artistIds)
            })
            const { originaldate, originalyear, releasedate, date } = metadata.common
            const thumbnail = coverBase64 ?? 'default-thumbnail.png'
            song = {
                ...song,
                alias: slugify(song.title),
                releaseDate: metadata.common.date,
                duration: Math.floor(metadata.format.duration ?? 0),
                artistNames: findArtists.map(a => a.name).join(", "),
                hasLyrics: !!lyricsFile,
            }
            fs.unlinkSync(audioFile.path)
            fs.unlinkSync(lyricsFile.path)
            return response.json({ song })

            // const song = await db.insert(songs).values(songBody)
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