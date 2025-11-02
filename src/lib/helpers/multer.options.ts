import multer from "multer"
import { extname } from "path"
import { BadRequestException } from "../exceptions"

type Options = {
    allowedFields: string[]
    fileSize?: number
}

export const multerOptions = (options: Options): multer.Options => {
    return {
        storage: multer.diskStorage({
            destination: 'uploads/',
            filename: (_, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
        limits: {
            fileSize: options.fileSize ?? 5_000_000, // 5MB default
        },
        fileFilter: (_req, file, callback) => {
            // Allowed file types
            const allowedTypes = /jpeg|jpg|png|gif/
            const ext = file.originalname.split(".").pop()?.toLowerCase()
            const mimetype = allowedTypes.test(file.mimetype)
            if (!ext || !mimetype) {
                return callback(new BadRequestException("Only images (jpg, jpeg, png, gif) are allowed"))
            }
            // validate field name
            if (options.allowedFields.length > 0 && !options.allowedFields.includes(file.fieldname)) {
                return callback(new BadRequestException(`Invalid field name: ${file.fieldname}`))
            }
            callback(null, true)
        }
    }
}
