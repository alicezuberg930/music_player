import { NextFunction, Request, Response } from "express"
import { HttpException, UnauthorizedException } from '@yukikaze/lib/exception'
import { env } from "@yukikaze/lib/create-env"
import { JWT, JWTHeader } from "@yukikaze/lib/jwt"

export const JWTMiddleware = async (request: Request, _: Response, next: NextFunction) => {
    let token: string | undefined = request.cookies?.["accessToken"]
    if (!token && request.headers.authorization?.startsWith("Bearer")) {
        token = request.headers.authorization.split(" ")[1]
    }
    if (!token) {
        throw new UnauthorizedException("Invalid credentials, please log in")
    }
    // Verify token signature annd expiration 
    try {
        const jwt = await new JWT(env.JWT_SECRET).verify(token) as { id: string } & JWTHeader
        if (!jwt || !jwt.id) {
            throw new UnauthorizedException("Invalid or expired access token")
        }
        request.userId = jwt.id
    } catch (error) {
        if (error instanceof HttpException) throw error
    }
    next()
}

// Optional JWT middleware - extracts user ID if token exists, but doesn't require authentication
export const OptionalJWTMiddleware = async (request: Request, _: Response, next: NextFunction) => {
    let token: string | undefined = request.cookies?.["accessToken"]
    if (!token && request.headers.authorization?.startsWith("Bearer")) {
        token = request.headers.authorization.split(" ")[1]
    }
    if (token) {
        try {
            const jwt = await new JWT(env.JWT_SECRET).verify(token) as { id: string } & JWTHeader
            if (jwt && jwt.id) request.userId = jwt.id
        } catch (error) {
            console.log(error)
        }
    }
    next()
}