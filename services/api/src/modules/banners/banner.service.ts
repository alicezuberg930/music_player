import { Request, Response } from "express"
import { db, eq } from "@yukikaze/db"
import { banners } from "@yukikaze/db/schemas"
import { BadRequestException, HttpException, NotFoundException } from "../../lib/exceptions"
import { CreateBannerDto } from "./dto/create-banner.dto"
import { deleteFile, extractPublicId, uploadFile } from "../../lib/helpers/cloudinary.file"
import { UpdateBannerDto } from "./dto/update-banner.dto"
import { createId } from "@yukikaze/lib/create-cuid"
import { Banner } from "./banner.model"
import { resizeImageToBuffer } from "@yukikaze/lib/image-resize"
import fs from "node:fs"

export class BannerService {
    public async getBanners(_: Request, response: Response) {
        try {
            const data = await db.query.banners.findMany()
            return response.json({ message: 'Banners fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async createBanner(request: Request<{}, {}, CreateBannerDto>, response: Response) {
        try {
            const { name } = request.body
            let thumbnailUrl: string | null = null
            const files = request.files as { [fieldname: string]: Express.Multer.File[] }
            const thumbnailFile: Express.Multer.File | null = files['thumbnail']?.[0] ?? null
            if (!thumbnailFile) {
                throw new BadRequestException('Thumbnail is required')
            }
            // Read file into buffer first to release file handle
            const originalBuffer = fs.readFileSync(thumbnailFile.path)
            // Resize image from buffer
            const resizedBuffer = await resizeImageToBuffer(originalBuffer, {
                height: 400,
                aspectRatio: '16:9',
                fit: 'cover',
            })
            fs.writeFileSync(thumbnailFile.path, resizedBuffer)
            thumbnailUrl = (await uploadFile(thumbnailFile, '/banner', createId())) as string
            const banner = {
                name: name ?? null,
                thumbnail: thumbnailUrl
            } as Banner
            await db.insert(banners).values(banner)
            return response.status(201).json({ message: "Banner created successfully" })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async updateBanner(request: Request<{ id: string }, {}, UpdateBannerDto>, response: Response) {
        try {
            const { id } = request.params
            const banner = await db.query.banners.findFirst({
                where: eq(banners.id, id)
            })
            if (!banner) throw new NotFoundException('Banner not found')
            const { name } = request.body
            const files = request.files as { [fieldname: string]: Express.Multer.File[] }
            const thumbnailFile: Express.Multer.File | null = files['thumbnail']?.[0] ?? null
            let thumbnail: string | undefined = undefined
            if (thumbnailFile) {
                // Read file into buffer first to release file handle
                const originalBuffer = fs.readFileSync(thumbnailFile.path)
                // Resize image from buffer
                const resizedBuffer = await resizeImageToBuffer(originalBuffer, {
                    height: 400,
                    aspectRatio: '16:9',
                    fit: 'cover',
                    quality: 100
                })
                fs.writeFileSync(thumbnailFile.path, resizedBuffer)
                thumbnail = (await uploadFile(thumbnailFile, '/banner', extractPublicId(banner.thumbnail))) as string
            }
            const updateData = {
                ...name !== undefined && { name },
                ...thumbnail !== undefined && { thumbnail }
            } as Banner
            await db.update(banners).set(updateData).where(eq(banners.id, id))
            return response.json({ message: 'Banner updated successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async findBanner(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const banner = await db.query.banners.findFirst({ where: eq(banners.id, id) })
            if (!banner) throw new NotFoundException('Banner not found')
            return response.json({ message: 'Banner fetched successfully', data: banner })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async deleteBanner(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const banner = await db.query.banners.findFirst({ where: eq(banners.id, id) })
            if (!banner) throw new NotFoundException('Banner not found')
            // Delete thumbnail from cloudinary if it exists and is not a default asset
            if (banner.thumbnail) {
                await deleteFile(extractPublicId(banner.thumbnail))
            }
            await db.delete(banners).where(eq(banners.id, id))
            return response.json({ message: 'Banner deleted successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}