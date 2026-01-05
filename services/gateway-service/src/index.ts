import express, { Request, Response } from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import { env } from '@yukikaze/lib/create-env'
import { rateLimiter } from './middleware/rate.limiter'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { UnauthorizedException } from '@yukikaze/lib/exception'
import http, { ClientRequest, IncomingMessage, ServerResponse } from 'node:http'
import { Socket } from 'node:net'
import { db } from "@yukikaze/db"
import { logs } from '@yukikaze/db/schemas'
import { errorInterceptor } from './middleware/error.interceptor'
const app = express()

app.set('trust proxy', 1)

// Health check endpoint (before CORS to allow Docker healthchecks)
app.get('/check', (_: Request, res: Response) => {
    res.json({ message: 'Welcome to YukikazeMP3 Express Gateway!' })
})

const allowedOrigins = new Set([
    'http://192.168.2.100:5173',
    'http://localhost:5173',
    'https://tien-music-player.site',
    'https://www.tien-music-player.site'
])

const skipCorsForPaths = [
    /^\/api\/v1\/auth\/callback\/.+/,
    /^\/api\/v1\/auth\/provider\/.+/
]

// setup cors 
app.use((req, res, next) => {
    // Skip CORS for OAuth provider routes (they handle redirects)
    if (skipCorsForPaths.some((pattern) => pattern.test(req.path))) {
        return next()
    }
    // Apply CORS for all other routes
    cors({
        origin: function (origin, callback) {
            if (!origin && env.ALLOW_CORS_WITHOUT_ORIGIN === 'true') {
                return callback(null, true)
            }
            if (origin && allowedOrigins.has(origin)) {
                return callback(null, true)
            }
            return callback(new UnauthorizedException(`${origin} not allowed by our CORS Policy.`))
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })(req, res, next)
})

// parse cookies 
app.use(cookieParser())

const port = env.GATEWAY_PORT

// global rate limiter
app.use(rateLimiter)

const routes: Map<string, string> = new Map([
    ['/api/v1/home', `http://${env.HOME_SERVICE_HOST}:${env.HOME_SERVICE_PORT}`],
    ['/api/v1/auth', `http://${env.AUTH_SERVICE_HOST}:${env.AUTH_SERVICE_PORT}`],
    ['/api/v1/songs', `http://${env.SONG_SERVICE_HOST}:${env.SONG_SERVICE_PORT}`],
    ['/api/v1/banners', `http://${env.BANNER_SERVICE_HOST}:${env.BANNER_SERVICE_PORT}`],
    ['/api/v1/artists', `http://${env.ARTIST_SERVICE_HOST}:${env.ARTIST_SERVICE_PORT}`],
    ['/api/v1/playlists', `http://${env.PLAYLIST_SERVICE_HOST}:${env.PLAYLIST_SERVICE_PORT}`],
    ['/api/v1/users', `http://${env.USER_SERVICE_HOST}:${env.USER_SERVICE_PORT}`],
])

const onProxyRequest = (proxyReq: ClientRequest, req: IncomingMessage, target: string) => {
    // Forward cookies and headers
    if (req.headers.cookie) {
        proxyReq.setHeader('cookie', req.headers.cookie)
    }
    if (req.headers.authorization) {
        proxyReq.setHeader('authorization', req.headers.authorization)
    }
    const now = new Date()
    const timestamp = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    const message = `[${timestamp}] [${proxyReq.path}] Proxying ${req.method} request from ${req.url} to ${target}${proxyReq.path}`
    db.insert(logs).values({
        message,
        environment: env.NODE_ENV === "production" ? 'production' : 'development',
        level: 'info',
        ipAddress: req.socket.remoteAddress || ''
    }).then(() => {
        // Successfully logged to database
    }).catch((error) => {
        console.error('Failed to log to database:', error)
    })
    console.info(message)
}

const onError = (err: Error, req: IncomingMessage, res: ServerResponse<IncomingMessage> | Socket) => {
    const now = new Date()
    const timestamp = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    const message = `[${timestamp}] Error proxying request to ${req.url}: ${err.message} - Stack: ${err.stack}`
    if (env.NODE_ENV === 'production') {
        db.insert(logs).values({
            message,
            environment: env.NODE_ENV === "production" ? 'production' : 'development',
            level: 'error',
            ipAddress: req.socket.remoteAddress || ''
        }).then(() => {
            // Successfully logged error to database
        }).catch((error) => {
            console.error('Failed to log error to database:', error)
        })
    }
    console.error(message)
    // send HTTP error response
    if (res instanceof ServerResponse && !res.headersSent) {
        res.writeHead(503, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
            message: 'The requested service is currently unavailable. Please try again later.',
            stack: err.stack
        }))
    }
}

routes.forEach((target, path) => {
    app.use(path, createProxyMiddleware({
        target,
        pathRewrite: { [`^${path}`]: '' },
        secure: env.NODE_ENV === 'production',
        changeOrigin: true,
        on: {
            error: (err, req, res) => onError(err, req, res),
            proxyReq: (proxyReq, req) => onProxyRequest(proxyReq, req, target),
            proxyRes: (proxyRes, req, res) => {
                // const origin = req.headers.origin
                // Set CORS headers on the response from the target service
                // if (origin && allowedOrigins.has(origin)) {
                //     if (!proxyRes.headers['access-control-allow-origin']) {
                //         proxyRes.headers['access-control-allow-origin'] = origin
                //     }
                //     if (!proxyRes.headers['access-control-allow-credentials']) {
                //         proxyRes.headers['access-control-allow-credentials'] = 'true'
                //     }
                // }
            }
        }
    }))
})

app.use([errorInterceptor])

const server = http.createServer(app)

server.listen(port, () => {
    routes.forEach((target, path) => {
        console.info(`[${path.replace('/api/v1/', '').toUpperCase()} Service]: Started on ${target}`)
    })
})