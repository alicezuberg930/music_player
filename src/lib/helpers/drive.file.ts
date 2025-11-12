import { drive_v3, google } from 'googleapis'
import env from './env'
import fs from 'fs'
import { BadRequestException } from '../exceptions'

const REFRESH_TOKEN = env.GOOGLE_REFRESH_TOKEN

const ROOT_FOLDER_ID = '1dz87C_CCZiFKUMfnRwd3BaqqCMFm5u9z'

const oauth2Client = new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
)

const getDriveClient = () => {
    if (!REFRESH_TOKEN) throw new BadRequestException('No refresh token set. Go to /auth/google first.')
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
    return google.drive({ version: 'v3', auth: oauth2Client })
}

export type UploadResult = {
    id: string
    name: string
    webViewLink: string
    webContentLink: string
}

const checkOrCreateSubfolder = async (drive: drive_v3.Drive, subFolder: string): Promise<string> => {
    // separate subFolder path string into multiple folders '/folder/sub_folder' -> ['folder', 'sub_folder']
    const segments = subFolder.split('/').map(s => s.trim()).filter(Boolean)
    if (segments.length === 0) return ROOT_FOLDER_ID
    let currentParentId = ROOT_FOLDER_ID
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
        })
        // check if the sub folder exists by seeing if there are any file returned
        const existing = listRes.data.files?.[0]
        if (existing?.id) {
            currentParentId = existing.id
        } else {
            // Create new sub folder
            const createRes = await drive.files.create({
                requestBody: {
                    name,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [currentParentId],
                },
                fields: 'id',
            })
            if (!createRes.data.id) throw new BadRequestException(`Failed to create subfolder "${name}"`)
            currentParentId = createRes.data.id
        }
    }
    return currentParentId
}

export const uploadFile = async (files: Express.Multer.File[] | Express.Multer.File, subFolder?: string): Promise<UploadResult | UploadResult[]> => {
    try {
        const tempFiles = Array.isArray(files) ? files : [files]
        const drive = getDriveClient()
        const currentParentId = subFolder ? await checkOrCreateSubfolder(drive, subFolder) : ROOT_FOLDER_ID
        // Upload all files to google drive concurrently
        const result: UploadResult[] = await Promise.all(
            tempFiles.map(async (file) => {
                const { path, mimetype, filename } = file
                console.log(file)
                const fileStream = fs.createReadStream(path)
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
                }) as { data: UploadResult }
                // Make file public for downloading so it can be loaded to audio player
                await drive.permissions.create({
                    fileId: data.id,
                    requestBody: { role: 'reader', type: 'anyone' },
                })
                return data
            })
        )
        // Delete all local files concurrently
        await Promise.all(
            tempFiles.map((file) =>
                fs.unlink(file.path, (err) => {
                    if (err) console.error(`Error deleting file ${file.path} :${err.message}`)
                })
            )
        )
        return result.length > 1 ? result : result[0]
    } catch (error) {
        throw new BadRequestException(error instanceof Error ? error.message : undefined)
    }
}

export const deleteFile = async (fileIds: string | string[]): Promise<any> => {
    try {
        let tempIds = Array.isArray(fileIds) ? fileIds : [fileIds]
        const drive = getDriveClient()
        await Promise.all(
            tempIds.map(async (id) => {
                await drive.files.delete({ fileId: id })
            })
        )
    } catch (error) {
        throw new BadRequestException(error instanceof Error ? error.message : undefined)
    }
}