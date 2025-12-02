import rateLimit from 'express-rate-limit'
import { Request, Response } from 'express'

export const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limit each IP to 50 requests per 1 minute
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (_req: Request, res: Response) => {
        return res.status(429).json({ statusCode: 429, message: 'Too many requests, please try again later.' })
    }
})