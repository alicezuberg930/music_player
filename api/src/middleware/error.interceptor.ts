import { Request, Response, NextFunction } from "express"
import { HttpException } from "../lib/exceptions/HttpException"
import { MulterError } from "multer"

export function errorInterceptor(err: unknown, req: Request, res: Response, _next: NextFunction) {
    // console.error(err)

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

    const errorResponse: Record<string, any> = {
        statusCode: status,
        message,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    }

    res.status(status).json(errorResponse)
}