"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.extractPublicId = exports.uploadFile = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = __importDefault(require("./env"));
const fs_1 = __importDefault(require("fs"));
const exceptions_1 = require("../exceptions");
const utils_1 = require("../../db/utils");
cloudinary_1.v2.config({
    cloud_name: env_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.default.CLOUDINARY_API_KEY,
    api_secret: env_1.default.CLOUDINARY_API_SECRET,
});
const uploadFile = async (files, subFolder, publicId) => {
    const tempFiles = Array.isArray(files) ? files : [files];
    try {
        const uploadPromises = tempFiles.map((file) => cloudinary_1.v2.uploader.upload(file.path, {
            folder: `lili-music${subFolder}`,
            ...publicId && { public_id: publicId },
            ...!publicId && { public_id: (0, utils_1.createId)() },
            resource_type: 'auto',
            overwrite: true,
            invalidate: true,
            use_filename: false,
            unique_filename: false,
            use_asset_folder_as_public_id_prefix: false
        }));
        // Upload all files concurrently
        const uploadResults = await Promise.all(uploadPromises);
        // Extract URLs from results
        const fileUrls = uploadResults.map((result) => result.secure_url);
        // Delete all local files concurrently
        await Promise.all(tempFiles.map((file) => fs_1.default.unlink(file.path, (err) => {
            if (err)
                console.error(`Error deleting file ${file} :${err.message}`);
        })));
        console.log('Files uploaded to Cloudinary:', fileUrls);
        return fileUrls.length > 1 ? fileUrls : fileUrls[0];
    }
    catch (error) {
        await Promise.all(tempFiles.map((file) => fs_1.default.unlink(file.path, (err) => {
            if (err)
                console.error(`Error deleting file ${file} :${err.message}`);
        })));
        throw new exceptions_1.BadRequestException(JSON.stringify(error));
    }
};
exports.uploadFile = uploadFile;
const extractPublicId = (url) => url.split('/').slice(-3).join('/').replace(/\.[^/.]+$/, '');
exports.extractPublicId = extractPublicId;
const deleteFile = async (fileUrls) => {
    try {
        let tempURLs = Array.isArray(fileUrls) ? fileUrls : [fileUrls];
        await Promise.all(tempURLs.map(url => cloudinary_1.v2.uploader.destroy((0, exports.extractPublicId)(url))));
        console.log('Files deleted from Cloudinary:', tempURLs);
    }
    catch (error) {
        throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
    }
};
exports.deleteFile = deleteFile;
