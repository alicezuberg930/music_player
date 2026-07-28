import type { Server as HttpServer } from 'node:http'
import { env } from '@yukikaze/lib/create-env'
import { Server } from 'socket.io'
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
