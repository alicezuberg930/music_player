import http from 'http'
import { Server, Socket } from "socket.io"
import jwt, { JwtPayload } from "jsonwebtoken";
import env from '../../lib/helpers/env';
import { UnauthorizedException } from '../../lib/exceptions';

interface AuthenticatedSocket extends Socket {
    user?: JwtPayload
}

const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, env.JWT_SECRET_KEY!);
    } catch (err) {
        return null;
    }
};

export const realtimeChat = (app: any) => {
    const server = http.createServer(app)
    const io = new Server(server, {
        cors: {
            origin: ["*"],
            credentials: true,
        },
    })
    io.use((socket: AuthenticatedSocket, next) => {
        const token = socket.handshake.auth?.token
        if (!token) {
            return next(new UnauthorizedException("Access token required"))
        }

        const user = verifyToken(token)
        if (!user) {
            return next(new UnauthorizedException("Invalid or expired access token required"))
        }

        socket.user = user as JwtPayload
        next()
    })

    io.on("connection", (socket: AuthenticatedSocket) => {
        console.log("User connected", socket.id)

        socket.on("joinRoom", async (chatId, callback) => {
            socket.join(chatId)


            if (callback) callback()
        })

        socket.on("leaveRoom", (chatId) => {
            socket.leave(chatId)
        })

        socket.on("sendMessage", async ({ chatId, content }, callback) => {
            try {
                const from = socket.user!.id

                io.to(chatId).emit("newMessage", "")

                if (callback) callback({ success: true, message: "" })
            } catch (err) {
                if (callback) callback({ success: false, error: err instanceof Error && err.message })
            }
        })
    })
}