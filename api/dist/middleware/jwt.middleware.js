"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalJWTMiddleware = exports.JWTMiddleware = exports.jwtDecode = void 0;
const exceptions_1 = require("../lib/exceptions");
const jwtDecode = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
};
exports.jwtDecode = jwtDecode;
const JWTMiddleware = async (request, _, next) => {
    let token = request.cookies?.["accessToken"];
    if (!token && request.headers.authorization?.startsWith("Bearer")) {
        token = request.headers.authorization.split(" ")[1];
    }
    if (!token) {
        throw new exceptions_1.UnauthorizedException("Invalid credentials, please log in");
    }
    const jwt = (0, exports.jwtDecode)(token);
    if (!jwt || !jwt.id) {
        throw new exceptions_1.UnauthorizedException("Invalid or expired access token");
    }
    request.userId = jwt.id;
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
        const jwt = (0, exports.jwtDecode)(token);
        request.userId = jwt.id;
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
