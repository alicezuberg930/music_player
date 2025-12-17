import 'reflect-metadata'
import express, { Request, Response } from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import { env } from '@yukikaze/lib/create-env'
import { errorInterceptor, notFoundHandlerMiddleware, responseInterceptor, rateLimiter } from '@yukikaze/middleware'
import { artistRouter, playlistRouter, songRouter, userRouter, sitemapRouter, bannerRouter } from './modules'
import { UnauthorizedException } from '@yukikaze/lib/exception'
const app = express()

app.set('trust proxy', 1);

const allowedOrigins = new Set([
    'http://localhost:5173',
    'https://tien-music-player.site',
    'https://www.tien-music-player.site'
])

// Add response interceptor early
app.use(responseInterceptor)

// setup cors
app.use(cors({
    origin: function (origin, callback) {
        if (!origin && env.NODE_ENV !== 'production') {
            return callback(null, true)
        }
        if (origin && allowedOrigins.has(origin)) {
            return callback(null, true)
        }
        return callback(new UnauthorizedException(`${origin} is not allowed by CORS Policy.`))
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))

// parse cookies
app.use(cookieParser())

// for parsing content-type of application/json & application/x-www-form-urlencoded
// Increase body size limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '21mb' }))
app.use(express.json({ limit: '21mb' }))

const port = env.PORT || 5001

// global rate limiter
app.use(rateLimiter)

app.get('/check', (_: Request, res: Response) => {
    res.json({ message: 'Welcome to YukikazeMP3 Express Server!' })
})

// map routers to express server
app.use('/', [userRouter, playlistRouter, songRouter, artistRouter, bannerRouter, sitemapRouter])

// assign global middlewares to express server
app.use([notFoundHandlerMiddleware, errorInterceptor])

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})