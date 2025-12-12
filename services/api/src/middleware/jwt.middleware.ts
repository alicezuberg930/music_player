import { NextFunction, Request, Response } from "express"
import { UnauthorizedException } from "../lib/exceptions"
import { JwtPayload, verify } from "jsonwebtoken"
import { env } from "@yukikaze/lib/create-env"

export const JWTMiddleware = async (request: Request, _: Response, next: NextFunction) => {
    let token: string | undefined = request.cookies?.["accessToken"]
    if (!token && request.headers.authorization?.startsWith("Bearer")) {
        token = request.headers.authorization.split(" ")[1]
    }
    if (!token) {
        throw new UnauthorizedException("Invalid credentials, please log in")
    }
    // Verify token signature annd expiration automatically
    const jwt = verify(token, env.JWT_SECRET!) as JwtPayload & { id: string }
    if (!jwt || !jwt.id) {
        throw new UnauthorizedException("Invalid or expired access token")
    }
    if (jwt.exp && Date.now() >= jwt.exp * 1000) {
        throw new UnauthorizedException("Access token has expired, please log in again")
    }
    request.userId = jwt.id
    next()
}

// Optional JWT middleware - extracts user ID if token exists, but doesn't require authentication
export const OptionalJWTMiddleware = async (request: Request, _: Response, next: NextFunction) => {
    let token: string | undefined = request.cookies?.["accessToken"]
    if (!token && request.headers.authorization?.startsWith("Bearer")) {
        token = request.headers.authorization.split(" ")[1]
    }
    if (token) {
        // Verify token signature
        const jwt = verify(token, env.JWT_SECRET!) as JwtPayload & { id: string }
        if (jwt && jwt.id) {
            request.userId = jwt.id
        }
    }
    next()
}

// export const SocketMiddleware = async (socket, next) => {
//     try {
//         let token = null

//         if (socket.handshake.headers.cookie) {
//             const cookies = Object.fromEntries(
//                 socket.handshake.headers.cookie.split(" ").map(c => c.split("="))
//             )
//             token = cookies["accessToken"]
//         }

//         // fallback: lấy từ auth
//         if (!token) token = socket.handshake.auth?.token

//         if (!token) return next(new Error("Authentication error: Token required"))

//         const decoded = await jwtDecode(token)
//         if (!decoded?.employeeId) return next(new Error("Authentication error: Invalid token"))

//         socket.user = decoded
//         next()
//     } catch (error) {
//         console.error("protectSocket Error:", error)
//         next(new Error("Internal server error"))
//     }
// }