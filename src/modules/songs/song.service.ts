// lib
import { Request, Response } from 'express'
import { parseFile } from 'music-metadata'
import fs from 'fs'
import NodeID3 from 'node-id3';
// database
import { db, eq, inArray } from '../../db'
import { Song } from './song.model'
import { artists, songs, artistsSongs } from '../../db/schemas'
// utils
import { HttpException, BadRequestException, NotFoundException } from '../../lib/exceptions'
import slugify from '../../lib/helpers/slugify'
import { uploadFile } from '../../lib/helpers/upload-file'
// dto
import { CreateSongDto } from './dto/create-song.dto'

export class SongService {
    public async getSongs(request: Request, response: Response) {
        try {
            const data: Song[] = await db.query.songs.findMany({
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
            return response.json({ message: 'Song list fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async createSong(request: Request, response: Response) {
        try {
            const { title, releaseDate, artistIds } = request.body as CreateSongDto
            // files
            const files = request.files as { [fieldname: string]: Express.Multer.File[] }
            const audioFile: Express.Multer.File | null = files['audio']?.[0] ?? null
            if (!audioFile) throw new BadRequestException('Audio file is required')
            const lyricsFile: Express.Multer.File | null = files['lyrics']?.[0] ?? null
            const thumbnailFile: Express.Multer.File | null = files['thumbnail']?.[0] ?? null
            // initialize urls
            let lyricsUrl: string | null = null
            let thumbnailUrl: string | null = null
            // find artist names from artistIds
            const findArtists = await db.query.artists.findMany({ columns: { name: true }, where: inArray(artists.id, artistIds) })
            // extract metadata from audio file
            let metadata = await parseFile(audioFile.path)
            if (lyricsFile) {
                lyricsUrl = (await uploadFile(lyricsFile.path, 'lyrics')) as string
            }
            if (thumbnailFile) {
                // if the user uploaded a thumbnail file, embed it into the audio file's metadata
                NodeID3.update({
                    title,
                    releaseTime: releaseDate,
                    artist: findArtists.map(a => a.name).join("/"),
                    originalReleaseTime: releaseDate,
                    year: new Date(releaseDate).getFullYear().toString(),
                    originalYear: new Date(releaseDate).getFullYear().toString(),
                    image: {
                        mime: thumbnailFile.mimetype,
                        type: { id: 3, name: 'front cover' },
                        description: 'Cover Art',
                        imageBuffer: fs.readFileSync(thumbnailFile.path)
                    }
                }, audioFile.path)
                findArtists.map(artist => {
                    NodeID3.update({ artist: artist.name }, audioFile.path)
                })
                thumbnailUrl = (await uploadFile(thumbnailFile.path, 'thumbnails')) as string
            } else {
                const picture = metadata.common.picture?.[0]
                if (picture) {
                    const coverPath = `uploads/${Date.now() + '-' + Math.round(Math.random() * 1e9)}.${picture.format.split('/')[1]}`
                    fs.writeFileSync(coverPath, Buffer.from(picture.data))
                    thumbnailUrl = (await uploadFile(coverPath, 'thumbnails')) as string
                }
            }
            // upload audio file to cloud storage and get the url
            const audioUrl = await uploadFile(audioFile.path, 'audios')
            const song = {
                title, releaseDate,
                userId: request.userId!,
                size: audioFile.size,
                alias: slugify(title),
                duration: Math.floor(metadata.format.duration ?? 0),
                artistNames: findArtists.map(a => a.name).join(", "),
                hasLyrics: !!lyricsFile,
                stream: audioUrl as string,
                lyricsFile: lyricsUrl,
                thumbnail: thumbnailUrl ?? '/assets/default-song-thumbnail.png'
            } as Song
            const insertSong = await db.insert(songs).values(song)
            await db.insert(artistsSongs).values(artistIds.map(artistId => ({ songId: insertSong[0].insertId, artistId })))
            return response.json({ message: 'Song created successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async updateSong(request: Request, response: Response) {
        try {
            const { id } = request.params
            const body = request.body as Song
            const song = await db.update(songs).set(body).where(eq(songs.id, parseInt(id)))
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