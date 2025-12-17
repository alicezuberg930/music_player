import multer from 'multer'
import { extname } from 'node:path'
import { BadRequestException } from '@yukikaze/lib/exception'

export type PerFieldRule = {
    mimes: string[]
    exts: string[]
    maxSize?: number
}

export type Options = {
    allowedFields: string[]
    allowedMimes?: string[]
    allowedExts?: string[]
    allowed?: Record<string, PerFieldRule>
}

export const multerOptions = (options: Options): multer.Options => {
    return {
        storage: multer.diskStorage({
            destination: 'uploads/',
            filename: (_, file, callback) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
                const ext = extname(file.originalname)
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`
                callback(null, filename)
            },
        }),
        fileFilter: (_req, file, callback) => {
            // prefer for each field if available, fallback to global arrays
            const fieldRule: PerFieldRule | undefined = options.allowed?.[file.fieldname]
            const allowedMimes = (fieldRule?.mimes ?? options.allowedMimes ?? []).map(m => m.toLowerCase())
            const allowedExts = (fieldRule?.exts ?? options.allowedExts ?? []).map(e => e.toLowerCase())
            // If no rules configured, reject by default 
            if (allowedMimes.length === 0 && allowedExts.length === 0) {
                return callback(new BadRequestException(`No upload rules configured for field: ${file.fieldname}`))
            }
            // const ext = extname(file.originalname).replace(/^\./, '').toLowerCase()
            // const validMimetype = allowedMimes.length === 0 || allowedMimes.includes(file.mimetype.toLowerCase())
            // const validExtension = allowedExts.length === 0 || (!!ext && allowedExts.includes(ext))
            // if (!validExtension || !validMimetype) {
            //     const expected = (allowedExts.length ? allowedExts : []).join(', ') || '(unspecified)'
            //     return callback(new BadRequestException(`Only files of types: ${expected} are allowed for field ${file.fieldname}`))
            // }
            // validate field name
            if (options.allowedFields.length > 0 && !options.allowedFields.includes(file.fieldname)) {
                return callback(new BadRequestException(`Invalid field name: ${file.fieldname}`))
            }
            callback(null, true)
        }
    }
}
