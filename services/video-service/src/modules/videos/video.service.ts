// lib
import type { Request, Response } from 'express'
import fs from 'node:fs'
import { OutgoingHttpHeaders } from 'node:http'
import { Readable } from 'node:stream'
import NodeID3 from 'node-id3'
import { cached, invalidateCache } from "@yukikaze/redis"
// database
import { db, eq, inArray, and, like, or } from '@yukikaze/db'
import { artists, videos, artistsSongs, userFavoriteSongs, artistsVideos } from '@yukikaze/db/schemas'
// utils
import { HttpException, BadRequestException, NotFoundException } from '@yukikaze/lib/exception'
import slugify from '@yukikaze/lib/slugify'
import { deleteFile, extractPublicId, uploadFile } from "@yukikaze/upload"
import { createId } from "@yukikaze/lib/create-cuid"
import { resizeImageToBuffer } from '@yukikaze/lib/image-resize'
import { VideoValidators } from '@yukikaze/validator'

export class VideoService {
    public async getVideos(request: Request<{}, {}, {}, VideoValidators.QueryVideoParams>, response: Response) {
        try {
            let { page, limit, search } = request.query
            let currentPage = 1
            let currentLimit = 15
            if (page) currentPage = Number(page)
            if (limit) currentLimit = Number(limit)

            // Create cache key based on query parameters
            const cacheKey = `videos:list:page:${currentPage}:limit:${currentLimit}:search:${search || 'all'}}`

            const result = await cached(cacheKey, 3600, async () => {
                // Get total count with same search filter
                const condition = search ? or(like(videos.title, `%${search}%`), like(videos.artistNames, `%${search}%`)) : undefined
                const total = await db.$count(videos, condition)
                const totalPages = Math.ceil(total / currentLimit)

                const data = await db.query.videos.findMany({
                    where: condition,
                    limit: currentLimit,
                    offset: (currentPage - 1) * currentLimit,
                    orderBy: (videos, { desc }) => [desc(videos.createdAt)],
                    // with: {
                    //     user: { columns: { password: false, email: false } },
                    //     genres: {
                    //         columns: { id: false, genreId: false, songId: false },
                    //         with: { genre: true }
                    //     },
                    //     artists: {
                    //         columns: { id: false, artistId: false, songId: false },
                    //         with: { artist: true }
                    //     }
                    // }
                })

                // .then(result => result.map(song => ({
                // ...song,
                // artists: song.artists.map(a => a.artist),
                // genres: song.genres.map(g => g.genre)
                // })))
                // If user is logged in, check which songs they've liked
                let likedVideoIds: Set<string> = new Set()
                // if (request.userId) {
                //     const songIds = data.map(song => song.id)
                //     const likedSongs = await db.query.userFavoriteVideos.findMany({
                //         where: and(
                //             eq(userFavoriteSongs.userId, request.userId),
                //             inArray(userFavoriteSongs.songId, songIds)
                //         ),
                //         columns: { songId: true }
                //     })
                //     likedVideoIds = new Set(likedSongs.map(ls => ls.songId))
                // }
                const videosWithLikedStatus = data.map(video => ({
                    ...video,
                    liked: likedVideoIds.has(video.id)
                }))

                return {
                    data: videosWithLikedStatus,
                    paginate: {
                        limit: currentLimit,
                        currentPage,
                        totalPages,
                    }
                }
            })

            return response.json({
                message: 'Video list fetched successfully',
                ...result
            })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async createVideo(request: Request<{}, {}, VideoValidators.CreateVideoInput>, response: Response) {
        try {
            const { title, artistIds } = request.body
            const files = request.files as { [fieldname: string]: Express.Multer.File[] }
            const videoFile: Express.Multer.File | null = files['stream']?.[0] ?? null
            if (!videoFile) throw new BadRequestException('Video file is required')
            const thumbnailFile: Express.Multer.File | null = files['thumbnail']?.[0] ?? null
            // initialize urls
            let thumbnailUrl: string | null = null
            // find artist names from artistIds
            const findArtists = await db.query.artists.findMany({ columns: { name: true }, where: inArray(artists.id, artistIds) })
            // extract metadata from audio file
            const { parseFile } = await import('music-metadata')
            const metadata = await parseFile(videoFile.path)
            if (thumbnailFile) {
                // Read file into buffer first to release file handle
                const originalBuffer = fs.readFileSync(thumbnailFile.path)
                // Resize image from buffer
                const resizedBuffer = await resizeImageToBuffer(originalBuffer, {
                    height: 100, width: 100,
                    aspectRatio: '1:1',
                    fit: 'cover',
                })
                fs.writeFileSync(thumbnailFile.path, resizedBuffer)
                thumbnailUrl = (await uploadFile({ files: thumbnailFile, subFolder: '/cover', publicId: createId() })) as string
            } else {
                const picture = metadata.common.picture?.[0]
                if (picture) {
                    const coverPath = `uploads/${Date.now() + '-' + Math.round(Math.random() * 1e9)}.${picture.format.split('/')[1]}`
                    fs.writeFileSync(coverPath, Buffer.from(picture.data))
                    // Read file into buffer first to release file handle
                    const originalBuffer = fs.readFileSync(coverPath)
                    // Resize image from buffer
                    const resizedBuffer = await resizeImageToBuffer(originalBuffer, {
                        height: 100, width: 100,
                        aspectRatio: '1:1',
                        fit: 'cover',
                    })
                    fs.writeFileSync(coverPath, resizedBuffer)
                    const coverFile = {
                        path: coverPath,
                        mimetype: picture.format,
                        originalname: `cover.${picture.format.split('/')[1]}`
                    } as Express.Multer.File
                    thumbnailUrl = (await uploadFile({ files: coverFile, subFolder: '/cover', publicId: createId() })) as string
                }
            }
            // upload audio file to cloud storage and get the url
            const videoUrl = await uploadFile({ files: videoFile, subFolder: '/video', publicId: createId() })
            const video = {
                title,
                // releaseDate,
                userId: request.userId!,
                size: videoFile.size,
                alias: slugify(title),
                duration: Math.floor(metadata.format.duration ?? 0),
                artistNames: findArtists.map(a => a.name).join(", "),
                stream: videoUrl as string,
                thumbnail: thumbnailUrl ?? '/assets/default/default-video-thumbnail.png'
            }
            const insertVideo = await db.insert(videos).values(video).$returningId()
            await db.insert(artistsVideos).values(artistIds.map(artistId => ({ videoId: insertVideo[0]!.id, artistId })))
            await invalidateCache('songs:list:*')
            return response.status(201).json({ message: 'Video created successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async updateVideo(request: Request<{ id: string }, {}, VideoValidators.UpdateVideoInput>, response: Response) {
        try {
            const { id } = request.params
            const findVideo = await db.query.videos.findFirst({
                where: eq(videos.id, id),
                columns: { thumbnail: true, stream: true }
            })
            if (!findVideo) throw new NotFoundException('Video not found')
            const { title, artistIds } = request.body
            const files = request.files as { [fieldname: string]: Express.Multer.File[] }
            // const audioFile: Express.Multer.File | null = files['audio']?.[0] ?? null
            const thumbnailFile: Express.Multer.File | null = files['thumbnail']?.[0] ?? null
            let thumbnail: string | null = null
            let lyrics: string | null = null
            let findArtists: { name: string }[] = []
            // filter artistIds to add and remove
            if (artistIds && artistIds.length > 0) {
                findArtists = await db.query.artists.findMany({ columns: { name: true }, where: inArray(artists.id, artistIds) })
                const existingArtistSongs = await db.query.artistsSongs.findMany({
                    where: eq(artistsSongs.songId, id),
                    columns: { artistId: true }
                })
                const existingArtistIds = existingArtistSongs.map(a => a.artistId)
                const artistIdsToAdd = artistIds.filter(aid => !existingArtistIds.includes(aid))
                const artistIdsToRemove = existingArtistIds.filter(aid => !artistIds.includes(aid))
                if (artistIdsToAdd.length > 0) {
                    await db.insert(artistsSongs).values(artistIdsToAdd.map(artistId => ({ songId: id, artistId })))
                }
                // remove old artist-song relations
                if (artistIdsToRemove.length > 0) {
                    await db.delete(artistsSongs).where(and(
                        eq(artistsSongs.songId, id),
                        inArray(artistsSongs.artistId, artistIdsToRemove)
                    ))
                }
            }
            if (thumbnailFile) {
                // Read file into buffer first to release file handle
                const originalBuffer = fs.readFileSync(thumbnailFile.path)
                // Resize image from buffer
                const resizedBuffer = await resizeImageToBuffer(originalBuffer, {
                    height: 160, width: 90,
                    aspectRatio: '16:9',
                    fit: 'cover',
                })
                fs.writeFileSync(thumbnailFile.path, resizedBuffer)
                if (findVideo.thumbnail.includes('/assets/')) {
                    thumbnail = (await uploadFile({ files: thumbnailFile, subFolder: '/cover', publicId: createId() })) as string
                } else {
                    await uploadFile({ files: thumbnailFile, publicId: extractPublicId(findVideo.thumbnail) })
                }
            }
            const video = {
                ...findArtists.length > 0 && { artistNames: findArtists.map(a => a.name).join(", ") },
                ...title && ({ title }),
                ...thumbnail && { thumbnail },
            }
            if (Object.entries(video).length > 0) await db.update(videos).set(video).where(eq(videos.id, id))
            await invalidateCache('videos:list:*')
            return response.json({ message: 'Videos updated successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async findVideo(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const data = await db.query.videos.findFirst({
                where: eq(videos.id, id),
                with: {
                    user: {
                        columns: { password: false, email: false }
                    },
                    artists: {
                        columns: { id: false, artistId: false, videoId: false },
                        with: { artist: true }
                    }
                }
            }).then(video => video ? ({
                ...video,
                artists: video.artists.map(s => s.artist),
            }) : undefined)
            if (!data) throw new NotFoundException('Video not found')
            return response.json({ message: 'Video fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async deleteVideo(request: Request<{ id: string }, {}>, response: Response) {
        try {
            const findVideo = await db.query.videos.findFirst({
                where: eq(videos.id, request.params.id),
                columns: { stream: true, thumbnail: true }
            })
            if (!findVideo) throw new NotFoundException('Video not found')
            const deleteUrls = [
                findVideo.stream!,
                ...(findVideo.thumbnail && !findVideo.thumbnail.includes('/assets/') ? [findVideo.thumbnail] : [])
            ]
            await deleteFile(deleteUrls)
            await db.delete(videos).where(eq(videos.id, request.params.id))
            await invalidateCache('songs:list:*')
            return response.json({ message: 'Song deleted successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async addVideoView(request: Request<{ id: string }, {}>, response: Response) {
        try {
            const { id } = request.params
            const findVideo = await db.query.videos.findFirst({
                where: eq(videos.id, id),
                columns: { id: true, views: true }
            })
            if (!findVideo) throw new NotFoundException('Song not found')
            await db.update(videos).set({ views: (findVideo.views ?? 0) + 1 }).where(eq(videos.id, id))
            return response.json({ message: 'Video view added successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async streamVideo(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const findVideo = await db.query.videos.findFirst({ where: eq(videos.id, id), columns: { stream: true, size: true } })
            if (!findVideo || !findVideo.stream) throw new NotFoundException('Video not found')

            const range = request.headers.range
            const chunkSize = 1000 * 1024 // 1000KB
            const videoSize = findVideo.size || 0
            // define start and end of current chunk
            const start = Number(range?.replace(/\D/g, ''))
            const end = Math.min(start + chunkSize, videoSize - 1)
            const contentLength = end - start + 1

            // make request to Cloudinary to get file with range header
            const vidoeResponse = await fetch(findVideo.stream, { headers: { Range: `bytes=${start}-${end}` } })
            if (!vidoeResponse.ok) throw new BadRequestException('Failed to fetch video from storage')
            console.log(`fetching chunk for video`, id, `(${start}-${end}/${videoSize})`)

            const headers: OutgoingHttpHeaders = {
                'Content-Range': `bytes ${start}-${end}/${videoSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': contentLength.toString(),
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
            }
            response.writeHead(206, headers)

            const stream = vidoeResponse.body
            if (stream) {
                const nodeStream = Readable.fromWeb(stream)
                nodeStream.pipe(response)
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}