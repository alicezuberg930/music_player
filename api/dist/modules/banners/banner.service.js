"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerService = void 0;
const db_1 = require("../../db");
const schemas_1 = require("../../db/schemas");
const exceptions_1 = require("../../lib/exceptions");
const cloudinary_file_1 = require("../../lib/helpers/cloudinary.file");
const utils_1 = require("../../db/utils");
class BannerService {
    async getBanners(_, response) {
        try {
            const data = await db_1.db.query.banners.findMany();
            return response.json({ message: 'Banners fetched successfully', data });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async createBanner(request, response) {
        try {
            const { name } = request.body;
            let thumbnailUrl = null;
            const files = request.files;
            const thumbnailFile = files['thumbnail']?.[0] ?? null;
            if (!thumbnailFile) {
                throw new exceptions_1.BadRequestException('Thumbnail is required');
            }
            thumbnailUrl = (await (0, cloudinary_file_1.uploadFile)(thumbnailFile, '/banner', (0, utils_1.createId)()));
            const banner = {
                name: name ?? null,
                thumbnail: thumbnailUrl
            };
            await db_1.db.insert(schemas_1.banners).values(banner);
            return response.status(201).json({ message: 'Banner created successfully' });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async updateBanner(request, response) {
        try {
            const { id } = request.params;
            const banner = await db_1.db.query.banners.findFirst({
                where: (0, db_1.eq)(schemas_1.banners.id, id)
            });
            if (!banner)
                throw new exceptions_1.NotFoundException('Banner not found');
            const { name } = request.body;
            const files = request.files;
            const thumbnailFile = files['thumbnail']?.[0] ?? null;
            let thumbnail = undefined;
            if (thumbnailFile) {
                thumbnail = (await (0, cloudinary_file_1.uploadFile)(thumbnailFile, '/banner', (0, cloudinary_file_1.extractPublicId)(banner.thumbnail)));
            }
            const updateData = {
                ...name !== undefined && { name },
                ...thumbnail !== undefined && { thumbnail }
            };
            await db_1.db.update(schemas_1.banners).set(updateData).where((0, db_1.eq)(schemas_1.banners.id, id));
            return response.json({ message: 'Banner updated successfully' });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async findBanner(request, response) {
        try {
            const { id } = request.params;
            const banner = await db_1.db.query.banners.findFirst({ where: (0, db_1.eq)(schemas_1.banners.id, id) });
            if (!banner)
                throw new exceptions_1.NotFoundException('Banner not found');
            return response.json({ message: 'Banner fetched successfully', data: banner });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
    async deleteBanner(request, response) {
        try {
            const { id } = request.params;
            const banner = await db_1.db.query.banners.findFirst({ where: (0, db_1.eq)(schemas_1.banners.id, id) });
            if (!banner)
                throw new exceptions_1.NotFoundException('Banner not found');
            // Delete thumbnail from cloudinary if it exists and is not a default asset
            if (banner.thumbnail) {
                await (0, cloudinary_file_1.deleteFile)((0, cloudinary_file_1.extractPublicId)(banner.thumbnail));
            }
            await db_1.db.delete(schemas_1.banners).where((0, db_1.eq)(schemas_1.banners.id, id));
            return response.json({ message: 'Banner deleted successfully' });
        }
        catch (error) {
            if (error instanceof exceptions_1.HttpException)
                throw error;
            throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
        }
    }
}
exports.BannerService = BannerService;
