import { fileTypeFromBuffer } from "file-type"
import { promises as fs } from "fs"
import type { Request, Response, NextFunction } from "express"
import { Options, PerFieldRule } from "../lib/helpers/multer.options"
import { BadRequestException } from "../lib/exceptions"

export const fileMimeAndSizeOptions = (options: Options) => {
    const perFieldRules: Record<string, PerFieldRule> = options.allowed ?? {}

    const fileMimeAndSizeMiddleware = async (request: Request, _response: Response, next: NextFunction) => {
        const filesMap = request.files as | Record<string, Express.Multer.File[]> | undefined
        if (!filesMap) next()
        try {
            for (const [fieldName, files] of Object.entries(filesMap!)) {
                const rule = perFieldRules[fieldName]
                // If no specific rule for this field, let multer's fileFilter handle it earlier
                if (!rule) continue
                const allowedMimes = (rule.mimes ?? []).map((m) => m.toLowerCase())
                const isTextOnlyField = allowedMimes.length > 0 && allowedMimes.every((m) => m.startsWith("text/"))
                const maxSize = rule.maxSize ?? 5 * 1024 * 1024

                for (const file of files) {
                    // check file limit
                    if (file.size > maxSize) {
                        await fs.unlink(file.path).catch(() => { })
                        throw new BadRequestException(`File for field "${fieldName}" exceeds the size limit of ${(maxSize / (1024 * 1024)).toFixed(1)} MB`)
                    }
                    // Read only first ~4KB, enough for magic bytes
                    const fd = await fs.open(file.path, "r")
                    try {
                        const buffer = Buffer.alloc(4100)
                        const { bytesRead } = await fd.read(buffer, 0, buffer.length, 0)
                        const slice = buffer.subarray(0, bytesRead)

                        const detected = await fileTypeFromBuffer(slice)

                        let isValid = false

                        if (detected) {
                            // file-type recognized the file (images, audio, etc.)
                            const realMime = detected.mime.toLowerCase()
                            isValid = allowedMimes.length === 0 || allowedMimes.includes(realMime)
                            if (isValid) {
                                // normalize mimetype to detected one for later logic
                                file.mimetype = realMime
                            }
                        } else {
                            // file-type can not detect text/plain
                            // For lyrics/text fields, accept if they are configured as text/*
                            if (isTextOnlyField) {
                                isValid = true
                            } else {
                                isValid = false
                            }
                        }
                        if (!isValid) {
                            await fs.unlink(file.path).catch(() => { })
                            throw new BadRequestException(`Only files of types: ${rule.exts.join(", ")} are allowed for field ${fieldName}.`)
                        }
                    } finally {
                        await fd.close()
                    }
                }
            }
            next()
        } catch (err) {
            throw new BadRequestException(err instanceof Error ? err.message : 'Invalid file upload')
        }
    }

    return fileMimeAndSizeMiddleware
}
