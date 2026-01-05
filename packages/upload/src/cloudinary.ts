import { createId } from '@yukikaze/lib/create-cuid'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { env } from '@yukikaze/lib/create-env'
import { BadRequestException } from '@yukikaze/lib/exception'
import type { CloudinaryCredentials, CloudinaryUploadResponse, ErrorResponse, UploadOptions } from './types'

const getCloudinaryCredentials = (): CloudinaryCredentials => {
    const cloudName = env.CLOUDINARY_CLOUD_NAME
    const apiKey = env.CLOUDINARY_API_KEY
    const apiSecret = env.CLOUDINARY_API_SECRET
    if (!cloudName || !apiKey || !apiSecret) {
        throw new BadRequestException(`Cloudinary credentials missing: cloud_name=${cloudName || 'missing'}, api_key=${apiKey || 'missing'}, api_secret=${apiSecret ? 'present' : 'missing'}`)
    }
    return { cloudName, apiKey, apiSecret }
}

const generateSignature = (params: Record<string, string>, apiSecret: string): string => {
    const sortedParams = Object.keys(params)
        .filter(key => params[key] !== undefined && params[key] !== null)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&')
    return crypto.createHash('sha1').update(sortedParams + apiSecret).digest('hex')
}

const cleanupLocalFiles = (files: Express.Multer.File[]): void => {
    files.forEach((file) =>
        fs.unlink(file.path, (err) => {
            if (err) console.error(`Error deleting file ${file.filename}: ${err.message}`)
        })
    )
}

export const uploadFile = async ({ files, subFolder, publicId }: UploadOptions): Promise<string | string[]> => {
    const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials()
    const tempFiles = Array.isArray(files) ? files : [files]
    try {
        const uploadPromises = tempFiles.map(async (file) => {
            const timestamp = Math.round(Date.now() / 1000)
            const folder = subFolder ? `lili-music${subFolder}` : undefined
            const public_id = publicId ?? createId()
            // Prepare signature parameters
            const signatureParams: Record<string, any> = {
                timestamp,
                public_id,
                overwrite: true,
                invalidate: true,
                use_filename: false,
                unique_filename: false,
            }
            if (folder) signatureParams.folder = folder
            const signature = generateSignature(signatureParams, apiSecret)
            // Prepare form data
            const formData = new FormData()
            const fileBuffer = fs.readFileSync(file.path)
            const blob = new Blob([fileBuffer])
            formData.append('file', blob, file.filename)
            formData.append('api_key', apiKey)
            formData.append('timestamp', timestamp.toString())
            formData.append('signature', signature)
            formData.append('public_id', public_id)
            formData.append('overwrite', 'true')
            formData.append('invalidate', 'true')
            formData.append('use_filename', 'false')
            formData.append('unique_filename', 'false')
            if (folder) formData.append('folder', folder)
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            )
            if (!response.ok) {
                cleanupLocalFiles(tempFiles)
                const errorData = await response.json() as ErrorResponse
                throw new BadRequestException(errorData.error?.message || 'Upload failed')
            }
            const result = await response.json() as CloudinaryUploadResponse
            return result
        })
        const uploadResults = await Promise.all(uploadPromises)
        const fileUrls = uploadResults.map((result) => result.secure_url)
        cleanupLocalFiles(tempFiles)
        console.log('Files uploaded to Cloudinary:', fileUrls)
        return fileUrls.length > 1 ? fileUrls : fileUrls[0]!
    } catch (error) {
        console.log(error)
        cleanupLocalFiles(tempFiles)
        throw new BadRequestException(error instanceof Error ? error.message : JSON.stringify(error))
    }
}

export const extractPublicId = (url: string): string => {
    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
    const parts = url.split('/')
    const uploadIndex = parts.findIndex(part => part === 'upload')
    if (uploadIndex === -1) return ''
    // Get everything after 'upload/v{version}/' or 'upload/'
    let publicIdWithExt = parts.slice(uploadIndex + 1).join('/')
    // Skip version if present (starts with 'v' followed by numbers)
    if (publicIdWithExt.match(/^v\d+\//)) {
        publicIdWithExt = publicIdWithExt.replace(/^v\d+\//, '')
    }
    // Remove file extension
    return publicIdWithExt.replace(/\.[^/.]+$/, '')
}

const getResourceType = (url: string): 'image' | 'video' | 'raw' => {
    const extension = url.split('.').pop()?.toLowerCase()
    if (['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'].includes(extension || ''))
        return 'video'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension || ''))
        return 'image'
    return 'raw'
}

export const deleteFile = async (fileUrls: string | string[]): Promise<void> => {
    const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials()
    try {
        const tempURLs = Array.isArray(fileUrls) ? fileUrls : [fileUrls]
        console.log(tempURLs.map(url => extractPublicId(url)))

        await Promise.all(tempURLs.map(async (url) => {
            const publicId = extractPublicId(url)
            const resourceType = getResourceType(url)
            const timestamp = Math.round(Date.now() / 1000).toString()
            // Prepare signature parameters
            const signatureParams = {
                public_id: publicId,
                timestamp,
            }
            const signature = generateSignature(signatureParams, apiSecret)
            // Prepare form data
            const formData = new FormData()
            formData.append('public_id', publicId)
            formData.append('api_key', apiKey)
            formData.append('timestamp', timestamp)
            formData.append('signature', signature)
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
                {
                    method: 'POST',
                    body: formData,
                }
            )
            if (!response.ok) {
                const errorData = await response.json() as ErrorResponse
                throw new BadRequestException(errorData.error?.message || 'Delete failed')
            }
            return await response.json()
        }))
    } catch (error) {
        throw new BadRequestException(error instanceof Error ? error.message : undefined)
    }
}