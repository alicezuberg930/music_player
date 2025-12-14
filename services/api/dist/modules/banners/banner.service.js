import { db, eq } from "@yukikaze/db";
import { banners } from "@yukikaze/db/schemas";
import { BadRequestException, HttpException, NotFoundException } from "@yukikaze/lib/exception";
import { deleteFile, extractPublicId, uploadFile } from "../../lib/helpers/cloudinary.file";
import { createId } from "@yukikaze/lib/create-cuid";
import { resizeImageToBuffer } from "@yukikaze/lib/image-resize";
import fs from "node:fs";
export class BannerService {
    async getBanners(_, response) {
        try {
            const data = await db.query.banners.findMany();
            return response.json({ message: 'Banners fetched successfully', data });
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async createBanner(request, response) {
        try {
            const { name } = request.body;
            let thumbnailUrl = null;
            const files = request.files;
            const thumbnailFile = files['thumbnail']?.[0] ?? null;
            if (!thumbnailFile) {
                throw new BadRequestException('Thumbnail is required');
            }
            // Read file into buffer first to release file handle
            const originalBuffer = fs.readFileSync(thumbnailFile.path);
            // Resize image from buffer
            const resizedBuffer = await resizeImageToBuffer(originalBuffer, {
                height: 400,
                aspectRatio: '16:9',
                fit: 'cover',
            });
            fs.writeFileSync(thumbnailFile.path, resizedBuffer);
            thumbnailUrl = (await uploadFile({ files: thumbnailFile, subFolder: '/banner', publicId: createId() }));
            const banner = {
                name: name ?? null,
                thumbnail: thumbnailUrl
            };
            await db.insert(banners).values(banner);
            return response.status(201).json({ message: "Banner created successfully" });
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async updateBanner(request, response) {
        try {
            const { id } = request.params;
            const banner = await db.query.banners.findFirst({
                where: eq(banners.id, id)
            });
            if (!banner)
                throw new NotFoundException('Banner not found');
            const { name } = request.body;
            const files = request.files;
            const thumbnailFile = files['thumbnail']?.[0] ?? null;
            let thumbnail = undefined;
            if (thumbnailFile) {
                // Read file into buffer first to release file handle
                const originalBuffer = fs.readFileSync(thumbnailFile.path);
                // Resize image from buffer
                const resizedBuffer = await resizeImageToBuffer(originalBuffer, {
                    height: 400,
                    aspectRatio: '16:9',
                    fit: 'cover',
                    quality: 100
                });
                fs.writeFileSync(thumbnailFile.path, resizedBuffer);
                await uploadFile({ files: thumbnailFile, publicId: extractPublicId(banner.thumbnail) });
            }
            const updateData = {
                ...name && { name },
            };
            if (Object.entries(updateData).length > 0)
                await db.update(banners).set(updateData).where(eq(banners.id, id));
            return response.json({ message: 'Banner updated successfully' });
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async findBanner(request, response) {
        try {
            const { id } = request.params;
            const banner = await db.query.banners.findFirst({ where: eq(banners.id, id) });
            if (!banner)
                throw new NotFoundException('Banner not found');
            return response.json({ message: 'Banner fetched successfully', data: banner });
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async deleteBanner(request, response) {
        try {
            const { id } = request.params;
            const banner = await db.query.banners.findFirst({ where: eq(banners.id, id) });
            if (!banner)
                throw new NotFoundException('Banner not found');
            // Delete thumbnail from cloudinary if it exists and is not a default asset
            if (banner.thumbnail) {
                await deleteFile(extractPublicId(banner.thumbnail));
            }
            await db.delete(banners).where(eq(banners.id, id));
            return response.json({ message: 'Banner deleted successfully' });
        }
        catch (error) {
            if (error instanceof HttpException)
                throw error;
            throw new BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
}
