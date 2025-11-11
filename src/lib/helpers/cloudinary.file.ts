import { v2 as cloudinary } from 'cloudinary'
import { UploadApiResponse } from 'cloudinary'
import env from './env'
import fs from 'fs'
import { BadRequestException } from '../exceptions'

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
})

export const uploadFile = async (files: string[] | string, subFolder?: string): Promise<string | string[]> => {
    try {
        const tempFiles = Array.isArray(files) ? files : [files]
        const uploadPromises = tempFiles.map((file) =>
            cloudinary.uploader.upload(file, {
                folder: `lili-music${subFolder ? `/${subFolder}` : ''}`,
                resource_type: 'raw'
            }),
        )
        // upload all files concurrently
        const uploadResults: UploadApiResponse[] = await Promise.all(uploadPromises)
        // Extract URLs from results
        const fileUrls = uploadResults.map((result) => result.secure_url)
        // Delete all local files concurrently
        await Promise.all(
            tempFiles.map((file) =>
                fs.unlink(file, (err) => {
                    if (err) console.error(`Error deleting file ${file} :${err.message}`)
                })
            )
        )
        return fileUrls.length > 1 ? fileUrls : fileUrls[0]
    } catch (error) {
        throw new BadRequestException(error instanceof Error ? error.message : undefined)
    }
}

const extractPublicId = (url: string): string => url.split('/').slice(-3).join('/').replace(/\.[^/.]+$/, '')

export const deleteFile = async (fileUrls: string | string[]): Promise<void> => {
    try {
        let tempURLs = Array.isArray(fileUrls) ? fileUrls : [fileUrls]
        await Promise.all(tempURLs.map(url => cloudinary.uploader.destroy(extractPublicId(url))))
    } catch (error) {
        throw new BadRequestException(error instanceof Error ? error.message : undefined)
    }
}