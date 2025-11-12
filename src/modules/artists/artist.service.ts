import { Request, Response } from "express"
import { db, eq, inArray } from "../../db"
import { Artist } from "./artist.model"
import { artists } from "../../db/schemas"
import { BadRequestException, HttpException, NotFoundException } from "../../lib/exceptions"
import { deleteFile, uploadFile } from "../../lib/helpers/cloudinary.file"
import { CreateArtistDto } from "./dto/create-artist.dto"
import { UpdateArtistDto } from "./dto/update-artist.dto"

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
                songs: artist.songs?.map(s => s?.song)
            })))
            return response.json({ message: 'Artists fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async createArtist(request: Request<{}, {}, CreateArtistDto>, response: Response) {
        try {
            const { name } = request.body
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

    public async updateArtist(request: Request<{ id: string }, {}, UpdateArtistDto>, response: Response) {
        try {
            const { id } = request.params
            const findArtist = await db.query.artists.findFirst({ where: eq(artists.id, parseInt(id)), columns: { thumbnail: true } })
            if (!findArtist) throw new NotFoundException('Artist not found')
            // 
            const { name } = request.body
            let thumbnailUrl: string | null = null
            const thumbnailFile: Express.Multer.File | null = request.file ?? null
            if (thumbnailFile) {
                if (!findArtist.thumbnail!.includes('/assets/')) {
                    await deleteFile(findArtist.thumbnail!)
                }
                thumbnailUrl = (await uploadFile(thumbnailFile.path, 'thumbnails')) as string
            }
            const artist = {
                name,
                thumbnail: thumbnailUrl ?? '/assets/default-artist.png'
            } as Artist
            await db.update(artists).set(artist).where(eq(artists.id, parseInt(id)))
            return response.json({ message: 'Artist updated successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async findArtist(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const data: Artist | undefined = await db.query.artists.findFirst({
                where: eq(artists.id, parseInt(id)),
                with: {
                    songs: {
                        columns: { id: false, artistId: false, songId: false },
                        with: { song: true }
                    },
                    playlists: {
                        columns: { id: false, artistId: false, playlistId: false },
                        with: { playlist: true }
                    }
                }
            }).then(artist => artist ? ({
                ...artist,
                songs: artist.songs.map(s => s.song),
                playlists: artist.playlists.map(p => p.playlist)
            }) : undefined)
            if (!data) throw new NotFoundException('Artist not found')
            return response.json({ message: 'Artist details fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}