"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.extractPublicId = exports.uploadFile = void 0;
const cloudinary_1 = require("cloudinary");
const create_env_1 = require("@yukikaze/lib/create-env");
const node_fs_1 = __importDefault(require("node:fs"));
const exceptions_1 = require("../exceptions");
const create_cuid_1 = require("@yukikaze/lib/create-cuid");
cloudinary_1.v2.config({
    cloud_name: create_env_1.env.CLOUDINARY_CLOUD_NAME,
    api_key: create_env_1.env.CLOUDINARY_API_KEY,
    api_secret: create_env_1.env.CLOUDINARY_API_SECRET,
});
const cleanupLocalFiles = (files) => {
    files.forEach((file) => node_fs_1.default.unlink(file.path, (err) => {
        if (err)
            console.error(`Error deleting file ${file.filename}: ${err.message}`);
    }));
};
const uploadFile = async ({ files, subFolder, publicId }) => {
    const tempFiles = Array.isArray(files) ? files : [files];
    try {
        const uploadPromises = tempFiles.map((file) => cloudinary_1.v2.uploader.upload(file.path, {
            ...subFolder && { folder: `lili-music${subFolder}` },
            public_id: publicId ?? (0, create_cuid_1.createId)(),
            resource_type: 'auto',
            overwrite: true,
            invalidate: true,
            use_filename: false,
            unique_filename: false,
            use_asset_folder_as_public_id_prefix: false
        }));
        const uploadResults = await Promise.all(uploadPromises);
        const fileUrls = uploadResults.map((result) => result.secure_url);
        cleanupLocalFiles(tempFiles);
        console.log('Files uploaded to Cloudinary:', fileUrls);
        return fileUrls.length > 1 ? fileUrls : fileUrls[0];
    }
    catch (error) {
        cleanupLocalFiles(tempFiles);
        throw new exceptions_1.BadRequestException(JSON.stringify(error));
    }
};
exports.uploadFile = uploadFile;
const extractPublicId = (url) => url.split('/').slice(-3).join('/').replace(/\.[^/.]+$/, '');
exports.extractPublicId = extractPublicId;
const getResourceType = (url) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'].includes(extension || ''))
        return 'video';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension || ''))
        return 'image';
    return 'raw';
};
const deleteFile = async (fileUrls) => {
    try {
        const tempURLs = Array.isArray(fileUrls) ? fileUrls : [fileUrls];
        console.log(tempURLs.map(url => (0, exports.extractPublicId)(url)));
        await Promise.all(tempURLs.map(url => cloudinary_1.v2.uploader.destroy((0, exports.extractPublicId)(url), {
            resource_type: getResourceType(url)
        })));
        // console.log('Files deleted from Cloudinary:', tempURLs)
    }
    catch (error) {
        throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
    }
};
exports.deleteFile = deleteFile;
