"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.realtimeChat = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../lib/helpers/env"));
const exceptions_1 = require("../../lib/exceptions");
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.default.JWT_SECRET_KEY);
    }
    catch (err) {
        return null;
    }
};
const realtimeChat = (app) => {
    const server = http_1.default.createServer(app);
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: ["*"],
            credentials: true,
        },
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new exceptions_1.UnauthorizedException("Access token required"));
        }
        const user = verifyToken(token);
        if (!user) {
            return next(new exceptions_1.UnauthorizedException("Invalid or expired access token required"));
        }
        socket.user = user;
        next();
    });
    io.on("connection", (socket) => {
        console.log("User connected", socket.id);
        socket.on("joinRoom", async (chatId, callback) => {
            socket.join(chatId);
            if (callback)
                callback();
        });
        socket.on("leaveRoom", (chatId) => {
            socket.leave(chatId);
        });
        socket.on("sendMessage", async ({ chatId, content }, callback) => {
            try {
                const from = socket.user.id;
                io.to(chatId).emit("newMessage", "");
                if (callback)
                    callback({ success: true, message: "" });
            }
            catch (err) {
                if (callback)
                    callback({ success: false, error: err instanceof Error && err.message });
            }
        });
    });
};
exports.realtimeChat = realtimeChat;
