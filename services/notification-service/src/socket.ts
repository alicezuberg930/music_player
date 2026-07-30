import type { Server as HttpServer } from 'node:http'
import { env } from '@yukikaze/lib/create-env'
import { JWT } from '@yukikaze/lib/jwt'
import { Server, type Socket } from 'socket.io'
import { ClientToServerEvents, ServerToClientEvents } from './lib/@types/socket'

const defaultAllowedOrigins = [
    'http://192.168.2.100:5173',
    'http://localhost:5173',
    'https://tien-music-player.site',
    'https://www.tien-music-player.site',
]

const allowedOrigins = process.env.NOTIFICATION_SERVICE_SOCKET_ORIGINS
    ? process.env.NOTIFICATION_SERVICE_SOCKET_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : defaultAllowedOrigins

const parseCookies = (cookieHeader: string | undefined) => {
    if (!cookieHeader) return {}
    return Object.fromEntries(
        cookieHeader.split(';').map((cookie) => cookie.trim()).filter(Boolean).map((cookie) => {
            const [rawName, ...rawValue] = cookie.split('=')
            return [rawName, rawValue.join('=')]
        }),
    )
}

const getAccessTokenFromSocket = (socket: Socket) => {
    const tokenFromAuth = socket.handshake.auth?.accessToken
    if (typeof tokenFromAuth === 'string' && tokenFromAuth.length > 0) {
        return tokenFromAuth
    }

    const cookies = parseCookies(socket.handshake.headers.cookie)
    const tokenFromCookie = cookies['accessToken']
    return typeof tokenFromCookie === 'string' && tokenFromCookie.length > 0 ? tokenFromCookie : undefined
}

export const createSocketServer = (httpServer: HttpServer) => {
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(
        httpServer,
        {
            cors: {
                origin: allowedOrigins,
                credentials: true,
            },
            allowRequest: (request, callback) => {
                const origin = request.headers.origin
                const allowWithoutOrigin = env.ALLOW_CORS_WITHOUT_ORIGIN === 'true'

                callback(
                    null,
                    origin ? allowedOrigins.includes(origin) : allowWithoutOrigin,
                )
            },
        },
    )

    io.on('connection', (socket) => {
        console.info(`[Socket.IO] Web client connected: ${socket.id}`)
        ;(async () => {
            const token = getAccessTokenFromSocket(socket)
            if (!token) return

            try {
                const payload = await new JWT<{ id: string }>(env.ACCESS_TOKEN_SECRET).verify(token)
                if (payload?.id) {
                    await socket.join(`user:${payload.id}`)
                    console.info(`[Socket.IO] User ${payload.id} joined room user:${payload.id}`)
                }
            } catch (error) {
                console.log('[Socket.IO] Failed to identify user for room join:', error)
            }
        })().catch(() => undefined)

        socket.emit('notification:connected', {
            socketId: socket.id,
            connectedAt: new Date().toISOString(),
        })

        socket.on('notification:ping', (acknowledge) => {
            acknowledge({ timestamp: new Date().toISOString() })
        })

        socket.on('disconnect', (reason) => {
            console.info(
                `[Socket.IO] Web client disconnected: ${socket.id} (${reason})`,
            )
        })
    })

    return io
}
