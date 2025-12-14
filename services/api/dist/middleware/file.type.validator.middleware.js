import { promises as fs } from "node:fs";
import { BadRequestException } from '@yukikaze/lib/exception';
import { esmFileType } from "../lib/helpers/esm.module";
const validateFileSize = async (file, maxSize, fieldName) => {
    if (file.size > maxSize) {
        await fs.unlink(file.path).catch(() => { });
        throw new BadRequestException(`File for field "${fieldName}" exceeds the size limit of ${(maxSize / (1024 * 1024)).toFixed(1)} MB`);
    }
};
const readFileBuffer = async (filePath) => {
    const fd = await fs.open(filePath, "r");
    try {
        const buffer = Buffer.alloc(4100);
        const { bytesRead } = await fd.read(buffer, 0, buffer.length, 0);
        return buffer.subarray(0, bytesRead);
    }
    finally {
        await fd.close();
    }
};
const validateMimeType = async (file, allowedMimes, isTextOnlyField, fieldName, rule) => {
    const slice = await readFileBuffer(file.path);
    const detected = await esmFileType().then(m => m.fileTypeFromBuffer(slice));
    let isValid = false;
    if (detected) {
        const realMime = detected.mime.toLowerCase();
        isValid = allowedMimes.length === 0 || allowedMimes.includes(realMime);
        if (isValid) {
            file.mimetype = realMime;
        }
    }
    else {
        isValid = isTextOnlyField;
    }
    if (!isValid) {
        await fs.unlink(file.path).catch(() => { });
        throw new BadRequestException(`Only files of types: ${rule.exts.join(", ")} are allowed for field ${fieldName}.`);
    }
};
const validateFile = async (file, rule, fieldName) => {
    const allowedMimes = (rule.mimes ?? []).map((m) => m.toLowerCase());
    const isTextOnlyField = allowedMimes.length > 0 && allowedMimes.every((m) => m.startsWith("text/"));
    const maxSize = rule.maxSize ?? 1 * 1024 * 1024;
    await validateFileSize(file, maxSize, fieldName);
    await validateMimeType(file, allowedMimes, isTextOnlyField, fieldName, rule);
};
export const fileMimeAndSizeOptions = (options) => {
    const perFieldRules = options.allowed ?? {};
    const fileMimeAndSizeMiddleware = async (request, _response, next) => {
        const filesMap = request.files;
        if (!filesMap)
            return next();
        try {
            for (const [fieldName, files] of Object.entries(filesMap)) {
                const rule = perFieldRules[fieldName];
                if (!rule)
                    continue;
                for (const file of files) {
                    await validateFile(file, rule, fieldName);
                }
            }
            next();
        }
        catch (err) {
            throw new BadRequestException(err instanceof Error ? err.message : 'Invalid file upload');
        }
    };
    return fileMimeAndSizeMiddleware;
};
