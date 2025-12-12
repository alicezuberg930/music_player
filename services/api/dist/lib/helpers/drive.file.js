"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadFile = exports.getDriveClient = void 0;
const googleapis_1 = require("googleapis");
const create_env_1 = require("@yukikaze/lib/create-env");
const fs_1 = __importDefault(require("fs"));
const exceptions_1 = require("../exceptions");
const REFRESH_TOKEN = create_env_1.env.GOOGLE_REFRESH_TOKEN;
const ROOT_FOLDER_ID = '1dz87C_CCZiFKUMfnRwd3BaqqCMFm5u9z';
const oauth2Client = new googleapis_1.google.auth.OAuth2(create_env_1.env.GOOGLE_CLIENT_ID, create_env_1.env.GOOGLE_CLIENT_SECRET, create_env_1.env.GOOGLE_REDIRECT_URI);
const getDriveClient = () => {
    if (!REFRESH_TOKEN)
        throw new exceptions_1.BadRequestException('No refresh token set. Go to /auth/google first.');
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    return googleapis_1.google.drive({ version: 'v3', auth: oauth2Client });
};
exports.getDriveClient = getDriveClient;
const checkOrCreateSubfolder = async (drive, subFolder) => {
    // separate subFolder path string into multiple folders '/folder/sub_folder' -> ['folder', 'sub_folder']
    const segments = subFolder.split('/').map(s => s.trim()).filter(Boolean);
    if (segments.length === 0)
        return ROOT_FOLDER_ID;
    let currentParentId = ROOT_FOLDER_ID;
    for (const name of segments) {
        // Find existing sub folder with this name under current parent folder
        const listRes = await drive.files.list({
            q: [
                `'${currentParentId}' in parents`,
                `name = '${name.replace(/'/g, "\\'")}'`,
                `mimeType = 'application/vnd.google-apps.folder'`,
                'trashed = false',
            ].join(' and '),
            fields: 'files(id, name)',
            spaces: 'drive',
            pageSize: 1
        });
        // check if the sub folder exists by seeing if there are any file returned
        const existing = listRes.data.files?.[0];
        if (existing?.id) {
            currentParentId = existing.id;
        }
        else {
            // Create new sub folder
            const createRes = await drive.files.create({
                requestBody: {
                    name,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [currentParentId],
                },
                fields: 'id',
            });
            if (!createRes.data.id)
                throw new exceptions_1.BadRequestException(`Failed to create subfolder "${name}"`);
            currentParentId = createRes.data.id;
        }
    }
    return currentParentId;
};
const uploadFile = async (files, subFolder) => {
    try {
        const tempFiles = Array.isArray(files) ? files : [files];
        const drive = (0, exports.getDriveClient)();
        const currentParentId = subFolder ? await checkOrCreateSubfolder(drive, subFolder) : ROOT_FOLDER_ID;
        // Upload all files to google drive concurrently
        const result = await Promise.all(tempFiles.map(async (file) => {
            const { path, mimetype, filename } = file;
            const fileStream = fs_1.default.createReadStream(path);
            // Specific folder with currentParentId
            const { data } = await drive.files.create({
                requestBody: {
                    name: filename,
                    parents: [currentParentId],
                },
                media: {
                    mimeType: mimetype,
                    body: fileStream,
                },
                fields: 'id, name, webViewLink, webContentLink',
            });
            // Make file public for downloading so it can be loaded to audio player
            await drive.permissions.create({
                fileId: data.id,
                requestBody: { role: 'reader', type: 'anyone' },
            });
            return data;
        }));
        // Delete all local files concurrently
        await Promise.all(tempFiles.map((file) => fs_1.default.unlink(file.path, (err) => {
            if (err)
                console.error(`Error deleting file ${file.path} :${err.message}`);
        })));
        return result.length > 1 ? result.map(r => r.webContentLink) : result[0].webContentLink;
    }
    catch (error) {
        throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
    }
};
exports.uploadFile = uploadFile;
const deleteFile = async (fileIds) => {
    try {
        let tempIds = Array.isArray(fileIds) ? fileIds : [fileIds];
        const drive = (0, exports.getDriveClient)();
        await Promise.all(tempIds.map(async (id) => {
            await drive.files.delete({ fileId: id });
        }));
    }
    catch (error) {
        throw new exceptions_1.BadRequestException(error instanceof Error ? error.message : undefined);
    }
};
exports.deleteFile = deleteFile;
