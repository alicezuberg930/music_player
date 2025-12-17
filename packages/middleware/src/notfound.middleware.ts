import type { Request, Response, NextFunction } from "express"
import { NotFoundException } from '@yukikaze/lib/exception'

export function notFoundHandlerMiddleware(req: Request, _res: Response, next: NextFunction) {
    next(new NotFoundException(`Route or Method not found. Cannot ${req.method} ${req.originalUrl}`))
}