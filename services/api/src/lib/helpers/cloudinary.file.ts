import { v2 as cloudinary } from 'cloudinary'
import { UploadApiResponse } from 'cloudinary'
import { env } from '@yukikaze/lib/create-env'
import fs from 'fs'
import { BadRequestException } from '../exceptions'
import { createId } from "@yukikaze/lib/create-cuid"

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
})

export const uploadFile = async (files: Express.Multer.File[] | Express.Multer.File, subFolder?: string, publicId?: string): Promise<string | string[]> => {
    const tempFiles = Array.isArray(files) ? files : [files]
    try {
        const uploadPromises = tempFiles.map((file) =>
            cloudinary.uploader.upload(file.path, {
                folder: `lili-music${subFolder}`,
                ...publicId && { public_id: publicId },
                ...!publicId && { public_id: createId() },
                resource_type: 'auto',
                overwrite: true,
                invalidate: true,
                use_filename: false,
                unique_filename: false,
                use_asset_folder_as_public_id_prefix: false
            }),
        )
        // Upload all files concurrently
        const uploadResults: UploadApiResponse[] = await Promise.all(uploadPromises)
        // Extract URLs from results
        const fileUrls = uploadResults.map((result) => result.secure_url)
        // Delete all local files concurrently
        await Promise.all(
            tempFiles.map((file) =>
                fs.unlink(file.path, (err) => {
                    if (err) console.error(`Error deleting file ${file} :${err.message}`)
                })
            )
        )
        console.log('Files uploaded to Cloudinary:', fileUrls)
        return fileUrls.length > 1 ? fileUrls : fileUrls[0]
    } catch (error) {
        await Promise.all(
            tempFiles.map((file) =>
                fs.unlink(file.path, (err) => {
                    if (err) console.error(`Error deleting file ${file} :${err.message}`)
                })
            )
        )
        throw new BadRequestException(JSON.stringify(error))
    }
}

export const extractPublicId = (url: string): string => url.split('/').slice(-3).join('/').replace(/\.[^/.]+$/, '')

export const deleteFile = async (fileUrls: string | string[]): Promise<void> => {
    try {
        let tempURLs = Array.isArray(fileUrls) ? fileUrls : [fileUrls]
        await Promise.all(tempURLs.map(url => cloudinary.uploader.destroy(extractPublicId(url))))
        console.log('Files deleted from Cloudinary:', tempURLs)
    } catch (error) {
        throw new BadRequestException(error instanceof Error ? error.message : undefined)
    }
}

