import { NextFunction, Request, Response } from "express"
import { UnauthorizedException } from "../lib/exceptions"
import { JsonWebTokenError, verify } from "jsonwebtoken"
import env from "../lib/helpers/env"

export const jwtDecode = (token: string): Record<string, string> => {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8')
    return JSON.parse(jsonPayload)
}

export const a = (token: string) => {
    try {
        const v = verify(token, env.JWT_SECRET!)
        console.log(v)
        return !!v
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            console.error("JWT Error:", error.message)
            return false
        }
    }
}

export const JWTMiddleware = async (request: Request, _: Response, next: NextFunction) => {
    let token: string | undefined = request.cookies?.["accessToken"]
    if (!token && request.headers.authorization?.startsWith("Bearer")) {
        token = request.headers.authorization.split(" ")[1]
    }
    if (!token) {
        throw new UnauthorizedException("Invalid credentials, please log in")
    }
    a(token)
    const jwt = jwtDecode(token)
    if (!jwt || !jwt.id) {
        throw new UnauthorizedException("Invalid or expired access token")
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
        const jwt = jwtDecode(token)
        request.userId = jwt.id
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