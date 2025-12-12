"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalJWTMiddleware = exports.JWTMiddleware = void 0;
const exceptions_1 = require("../lib/exceptions");
const jsonwebtoken_1 = require("jsonwebtoken");
const create_env_1 = require("@yukikaze/lib/create-env");
const JWTMiddleware = async (request, _, next) => {
    let token = request.cookies?.["accessToken"];
    if (!token && request.headers.authorization?.startsWith("Bearer")) {
        token = request.headers.authorization.split(" ")[1];
    }
    if (!token) {
        throw new exceptions_1.UnauthorizedException("Invalid credentials, please log in");
    }
    // Verify token signature annd expiration automatically
    try {
        const jwt = (0, jsonwebtoken_1.verify)(token, create_env_1.env.JWT_SECRET);
        if (!jwt || !jwt.id) {
            throw new exceptions_1.UnauthorizedException("Invalid or expired access token");
        }
        request.userId = jwt.id;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
            throw new exceptions_1.UnauthorizedException("JWT is expired");
        }
        else {
            throw new exceptions_1.InternalServerErrorException();
        }
    }
    next();
};
exports.JWTMiddleware = JWTMiddleware;
// Optional JWT middleware - extracts user ID if token exists, but doesn't require authentication
const OptionalJWTMiddleware = async (request, _, next) => {
    let token = request.cookies?.["accessToken"];
    if (!token && request.headers.authorization?.startsWith("Bearer")) {
        token = request.headers.authorization.split(" ")[1];
    }
    if (token) {
        // Verify token signature
        const jwt = (0, jsonwebtoken_1.verify)(token, create_env_1.env.JWT_SECRET);
        if (jwt && jwt.id) {
            request.userId = jwt.id;
        }
    }
    next();
};
exports.OptionalJWTMiddleware = OptionalJWTMiddleware;
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
