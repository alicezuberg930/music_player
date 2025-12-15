import express, { Request, Response } from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import { env } from '@yukikaze/lib/create-env'
import { rateLimiter } from './middleware/rate.limiter'
import { createProxyMiddleware } from 'http-proxy-middleware'
const app = express()

app.set('trust proxy', 1);

// setup cors
app.use(cors({
    origin: ['http://localhost:5173', 'https://tien-music-player.site', 'https://www.tien-music-player.site'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))

// parse cookies
app.use(cookieParser())

// for parsing content-type of application/json & application/x-www-form-urlencoded
// Increase body size limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '21mb' }))
app.use(express.json({ limit: '21mb' }))

const port = env.GATEWAY_PORT || 5000

// global rate limiter
app.use(rateLimiter)

app.get('/', (_: Request, res: Response) => {
    res.json({ message: 'Welcome to Tiếns MP3 Express Gateway!' })
})

const paths: Record<string, string> = {
    // '/api/v1/auth': `http://localhost:${env.AUTH_SERVICE_PORT || 5001}`,
    // '/api/v1/users': `http://localhost:${env.USER_SERVICE_PORT || 5002}`,
    // '/api/v1/artists': `http://localhost:${env.ARTIST_SERVICE_PORT || 5003}`,
    // '/api/v1/songs': `http://localhost:${env.SONG_SERVICE_PORT || 5004}`,
    // '/api/v1/albums': `http://localhost:${env.ALBUM_SERVICE_PORT || 5005}`,
    // '/api/v1/playlists': `http://localhost:${env.PLAYLIST_SERVICE_PORT || 5006}`,
}

const proxies = [

]

const proxy = createProxyMiddleware({
    target: `http://localhost:5001`,
    pathRewrite: { '^/api/v1': '' },
    secure: env.NODE_ENV === 'production',
    changeOrigin: true,
    on: {
        error: (error, _req, _res, _target) => {
            console.error(error);
        },
        proxyReq: (proxyReq, req, res) => {

        },
        proxyRes: (proxyRes, req, res) => {

        }
    }
})

app.use(proxy)

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})