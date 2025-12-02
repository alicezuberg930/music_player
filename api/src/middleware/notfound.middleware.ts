import { Request, Response, NextFunction } from "express"
import { NotFoundException } from "../lib/exceptions"

export function notFoundHandlerMiddleware(req: Request, _res: Response, next: NextFunction) {
    next(new NotFoundException(`Route or Method not found. Cannot ${req.method} ${req.originalUrl}`))
}