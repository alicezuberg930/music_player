import type { Request, Response, NextFunction } from "express"
import { HttpException } from "@yukikaze/lib/exception"
import { MulterError } from "multer"
import { env } from "@yukikaze/lib/create-env"

export function errorInterceptor(err: HttpException | MulterError, req: Request, res: Response, _next: NextFunction) {
    let status = 500
    let message = "Internal Server Error"

    if (err instanceof HttpException) {
        status = err.status
        message = err.message
    }

    if (err instanceof MulterError) {
        status = 400
        message = err.message
    }

    const errorResponse: Record<string, number | string> = {
        statusCode: status,
        message,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        ...env.NODE_ENV !== 'production' && { stack: err.stack }
    }

    res.status(status).json(errorResponse)
}