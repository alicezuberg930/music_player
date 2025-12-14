"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerService = void 0;
const db_1 = require("@yukikaze/db");
const schemas_1 = require("@yukikaze/db/schemas");
const exceptions_1 = require("../../lib/exceptions");
const cloudinary_file_1 = require("../../lib/helpers/cloudinary.file");
const create_cuid_1 = require("@yukikaze/lib/create-cuid");
const image_resize_1 = require("@yukikaze/lib/image-resize");
const node_fs_1 = __importDefault(require("node:fs"));
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
            // Read file into buffer first to release file handle
            const originalBuffer = node_fs_1.default.readFileSync(thumbnailFile.path);
            // Resize image from buffer
            const resizedBuffer = await (0, image_resize_1.resizeImageToBuffer)(originalBuffer, {
                height: 400,
                aspectRatio: '16:9',
                fit: 'cover',
            });
            node_fs_1.default.writeFileSync(thumbnailFile.path, resizedBuffer);
            thumbnailUrl = (await (0, cloudinary_file_1.uploadFile)({ files: thumbnailFile, subFolder: '/banner', publicId: (0, create_cuid_1.createId)() }));
            const banner = {
                name: name ?? null,
                thumbnail: thumbnailUrl
            };
            await db_1.db.insert(schemas_1.banners).values(banner);
            return response.status(201).json({ message: "Banner created successfully" });
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
                // Read file into buffer first to release file handle
                const originalBuffer = node_fs_1.default.readFileSync(thumbnailFile.path);
                // Resize image from buffer
                const resizedBuffer = await (0, image_resize_1.resizeImageToBuffer)(originalBuffer, {
                    height: 400,
                    aspectRatio: '16:9',
                    fit: 'cover',
                    quality: 100
                });
                node_fs_1.default.writeFileSync(thumbnailFile.path, resizedBuffer);
                await (0, cloudinary_file_1.uploadFile)({ files: thumbnailFile, publicId: (0, cloudinary_file_1.extractPublicId)(banner.thumbnail) });
            }
            const updateData = {
                ...name && { name },
            };
            if (Object.entries(updateData).length > 0)
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
