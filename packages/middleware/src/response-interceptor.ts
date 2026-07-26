import type { Request, Response, NextFunction } from "express"

export function responseInterceptor(req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json.bind(res)

    res.json = function (body: any) {
        // Add field to response body if not already present
        if (body && typeof body === 'object') {
            if (!body.statusCode) body.statusCode = res.statusCode || 200
            if (!body.timestamp) body.timestamp = new Date().toISOString()
            if (!body.path) body.path = req.originalUrl
            if (!body.method) body.method = req.method
        }
        return originalJson(body)
    }

    next()
}
