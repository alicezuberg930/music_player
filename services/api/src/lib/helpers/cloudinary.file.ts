import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { env } from '@yukikaze/lib/create-env'
import fs from 'node:fs'
import { BadRequestException } from '../exceptions'
import { createId } from "@yukikaze/lib/create-cuid"

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
})

const cleanupLocalFiles = (files: Express.Multer.File[]): void => {
    files.forEach((file) =>
        fs.unlink(file.path, (err) => {
            if (err) console.error(`Error deleting file ${file.filename}: ${err.message}`)
        })
    )
}

type UploadOptions = {
    files: Express.Multer.File[] | Express.Multer.File
    subFolder?: string
    publicId?: string
}

export const uploadFile = async ({ files, subFolder, publicId }: UploadOptions): Promise<string | string[]> => {
    const tempFiles = Array.isArray(files) ? files : [files]
    try {
        const uploadPromises = tempFiles.map((file) =>
            cloudinary.uploader.upload(file.path, {
                ...subFolder && { folder: `lili-music${subFolder}` },
                public_id: publicId ?? createId(),
                resource_type: 'auto',
                overwrite: true,
                invalidate: true,
                use_filename: false,
                unique_filename: false,
                use_asset_folder_as_public_id_prefix: false
            })
        )
        const uploadResults: UploadApiResponse[] = await Promise.all(uploadPromises)
        const fileUrls = uploadResults.map((result) => result.secure_url)
        cleanupLocalFiles(tempFiles)
        console.log('Files uploaded to Cloudinary:', fileUrls)
        return fileUrls.length > 1 ? fileUrls : fileUrls[0]
    } catch (error) {
        cleanupLocalFiles(tempFiles)
        throw new BadRequestException(JSON.stringify(error))
    }
}

export const extractPublicId = (url: string): string => url.split('/').slice(-3).join('/').replace(/\.[^/.]+$/, '')

const getResourceType = (url: string): 'image' | 'video' | 'raw' => {
    const extension = url.split('.').pop()?.toLowerCase()
    if (['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'].includes(extension || ''))
        return 'video'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension || ''))
        return 'image'
    return 'raw'
}

export const deleteFile = async (fileUrls: string | string[]): Promise<void> => {
    try {
        const tempURLs = Array.isArray(fileUrls) ? fileUrls : [fileUrls]
        console.log(tempURLs.map(url => extractPublicId(url)))
        await Promise.all(tempURLs.map(url =>
            cloudinary.uploader.destroy(extractPublicId(url), {
                resource_type: getResourceType(url)
            })
        ))
        // console.log('Files deleted from Cloudinary:', tempURLs)
    } catch (error) {
        throw new BadRequestException(error instanceof Error ? error.message : undefined)
    }
}