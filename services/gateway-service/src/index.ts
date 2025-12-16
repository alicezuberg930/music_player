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

const routes: Map<string, string> = new Map([
    ['/api/v1/app', `http://localhost:${env.PORT}`],
    ['/api/v1/home', `http://localhost:${env.HOME_SERVICE_PORT}`],
    // ['/api/v1/artists', `http://localhost:${env.ARTIST_SERVICE_PORT || 5003}`],
    // ['/api/v1/songs', `http://localhost:${env.SONG_SERVICE_PORT || 5004}`],
    // ['/api/v1/albums', `http://localhost:${env.ALBUM_SERVICE_PORT || 5005}`],
    // ['/api/v1/playlists', `http://localhost:${env.PLAYLIST_SERVICE_PORT || 5006}`],
    // ['/api/v1/users', `http://localhost:${env.USER_SERVICE_PORT || 5006}`],
])

routes.forEach((target, path) => {
    console.log(`Proxy setup: ${path} -> ${target}`);
    app.use(path, createProxyMiddleware({
        target,
        pathRewrite: { [`^${path}`]: '' },
        secure: env.NODE_ENV === 'production',
        changeOrigin: true,
        on: {
            error: (error, req, res) => {
                console.error(`Proxy error for ${path}:`, error.message);
            },
            proxyReq: (proxyReq, req, res) => {
                // Forward cookies and headers
                if (req.headers.cookie) {
                    proxyReq.setHeader('cookie', req.headers.cookie);
                }
                if (req.headers.authorization) {
                    proxyReq.setHeader('authorization', req.headers.authorization);
                }
                console.info(`[${path}] Proxying ${req.method} ${req.url} -> ${target}${req.url}`);
            },
            proxyRes: (proxyRes, req, res) => {
                console.info(`[${path}] Response status: ${proxyRes.statusCode}`);
            }
        }
    }))
})

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})