import 'reflect-metadata'
import express, { Request, Response } from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import env from './lib/helpers/env'
import { errorInterceptor, notFoundHandlerMiddleware, responseInterceptor } from './middleware'
import { artistRouter, playlistRouter, songRouter, userRouter } from './modules'
import { rateLimiter } from './middleware/rate.limiter'

const app = express()

// Add response interceptor early
app.use(responseInterceptor)

// setup cors
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://aismartlite.cloud', 'https://api.aismartlite.cloud', 'https://tien-music-player.site', 'https://www.tien-music-player.site'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))

// parse cookies
app.use(cookieParser())

// for parsing content-type of application/json & application/x-www-form-urlencoded
// Increase body size limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '21mb' }))
app.use(express.json({ limit: '21mb' }))

const port = env.PORT || 5000

// global rate limiter
app.use(rateLimiter)

app.get('/', (_: Request, res: Response) => {
    res.json({ message: 'Welcome to Tiếns MP3 Express Server!' })
})

// map routers to express server
app.use('/api/v1', [userRouter, playlistRouter, songRouter, artistRouter])

// assign global middlewares to express server
app.use([notFoundHandlerMiddleware, errorInterceptor])

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})