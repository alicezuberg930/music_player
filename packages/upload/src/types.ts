export type CloudinaryCredentials = {
    cloudName: string
    apiKey: string
    apiSecret: string
}

export type UploadOptions = {
    files: Express.Multer.File[] | Express.Multer.File
    subFolder?: string
    publicId?: string
}

export type CloudinaryUploadResponse = {
    secure_url: string
    public_id: string
    resource_type: string
    [key: string]: any
}

export type ErrorResponse = {
    error?: {
        message: string
    }
}