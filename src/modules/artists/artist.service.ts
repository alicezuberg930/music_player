import { Request, Response } from "express"
import { db, inArray } from "../../db"
import { Artist } from "./artist.model"
import { artists } from "../../db/schemas"
import { BadRequestException, HttpException } from "../../lib/exceptions"
import { uploadFile } from "../../lib/helpers/upload-file"
import { CreateArtistDto } from "./dto/create-artist.dto"

export class ArtistService {
    public async getArtists(request: Request, response: Response) {
        try {
            const { } = request.query
            const data: Artist[] = await db.query.artists.findMany({
                with: {
                    songs: {
                        columns: { id: false, artistId: false, songId: false },
                        with: { song: true }
                    }
                }
            }).then(result => result.map(artist => ({
                ...artist,
                songs: artist.songs.map(s => s.song)
            })))
            return response.json({ message: 'Artists fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async createArtist(request: Request, response: Response) {
        try {
            const { name } = request.body as CreateArtistDto
            let thumbnailUrl: string | null = null
            const thumbnailFile: Express.Multer.File | null = request.file ?? null
            if (thumbnailFile) {
                thumbnailUrl = (await uploadFile(thumbnailFile.path, 'thumbnails')) as string
            }
            const artist = {
                name,
                thumbnail: thumbnailUrl ?? '/assets/default-artist.png'
            } as Artist
            await db.insert(artists).values(artist)
            return response.status(201).json({ message: 'Artist created successfully', data: artist })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}