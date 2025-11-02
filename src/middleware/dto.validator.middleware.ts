import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"
import type { Request, Response, NextFunction } from "express"

export function validateDtoHanlder(DtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoObject = plainToInstance(DtoClass, req.body, { enableImplicitConversion: true })
        const errors = await validate(dtoObject, { whitelist: true })

        if (errors.length > 0) {
            return res.status(400).json({
                statusCode: 400,
                path: req.originalUrl,
                method: req.method,
                timestamp: new Date().toISOString(),
                message: "Field Validation failed",
                errors: errors.map(e => ({ ...e.constraints }))
            })
        }
        req.body = dtoObject
        next()
    }
}
