import { Request, Response } from "express"
import { db, eq } from "@yukikaze/db"
import { Artist } from "./artist.model"
import { artists } from "@yukikaze/db/schemas"
import { BadRequestException, HttpException, NotFoundException } from "../../lib/exceptions"
import { extractPublicId, uploadFile } from "../../lib/helpers/cloudinary.file"
import { CreateArtistDto } from "./dto/create-artist.dto"
import { UpdateArtistDto } from "./dto/update-artist.dto"
import { createId } from "@yukikaze/lib/create-cuid"
import { resizeImageToBuffer } from "@yukikaze/lib/image-resize"
import fs from "node:fs"

export class ArtistService {
    public async getArtists(request: Request, response: Response) {
        try {
            // const {  } = request.query
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
            // const checkExisting = await db.query.artists.findFirst({ where: like(artists.name, name) })
            // if (checkExisting) throw new BadRequestException('Artist with the same name already exists')
            const files = request.files as { [fieldname: string]: Express.Multer.File[] }
            const thumbnailFile: Express.Multer.File | null = files['thumbnail']?.[0] ?? null
            if (thumbnailFile) {
                // Read file into buffer first to release file handle
                const originalBuffer = fs.readFileSync(thumbnailFile.path)
                // Resize image from buffer
                const resizedBuffer = await resizeImageToBuffer(originalBuffer, {
                    height: 240, width: 240,
                    aspectRatio: '1:1',
                    fit: 'cover',
                    quality: 100
                })
                fs.writeFileSync(thumbnailFile.path, resizedBuffer)
                thumbnailUrl = (await uploadFile({ files: thumbnailFile, subFolder: '/avatar', publicId: createId() })) as string
            }
            const artist = {
                name,
                thumbnail: thumbnailUrl ?? '/assets/default/default-artist-avatar.png'
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
            const findArtist = await db.query.artists.findFirst({ where: eq(artists.id, id), columns: { thumbnail: true } })
            if (!findArtist) throw new NotFoundException('Artist not found')
            const { name } = request.body
            let thumbnailUrl: string | null = null
            const files = request.files as { [fieldname: string]: Express.Multer.File[] }
            const thumbnailFile: Express.Multer.File | null = files['thumbnail']?.[0] ?? null
            if (thumbnailFile) {
                // Read file into buffer first to release file handle
                const originalBuffer = fs.readFileSync(thumbnailFile.path)
                // Resize image from buffer
                const resizedBuffer = await resizeImageToBuffer(originalBuffer, {
                    height: 240, width: 240,
                    aspectRatio: '1:1',
                    fit: 'cover',
                    quality: 100
                })
                fs.writeFileSync(thumbnailFile.path, resizedBuffer)
                if (findArtist.thumbnail!.includes('/assets/')) {
                    thumbnailUrl = (await uploadFile({ files: thumbnailFile, subFolder: '/avatar', publicId: createId() })) as string
                } else {
                    await uploadFile({ files: thumbnailFile, publicId: extractPublicId(findArtist.thumbnail!) })
                }
            }
            const artist = {
                ...name && { name },
                ...thumbnailUrl && { thumbnail: thumbnailUrl }
            } as Artist
            if (Object.entries(artist).length > 0)
                await db.update(artists).set(artist).where(eq(artists.id, id))
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
                where: eq(artists.id, id),
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