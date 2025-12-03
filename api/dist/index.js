"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = __importDefault(require("./lib/helpers/env"));
const middleware_1 = require("./middleware");
const modules_1 = require("./modules");
const rate_limiter_1 = require("./middleware/rate.limiter");
const app = (0, express_1.default)();
// Add response interceptor early
app.use(middleware_1.responseInterceptor);
// setup cors
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://aismartlite.cloud', 'https://api.aismartlite.cloud', 'https://tien-music-player.site', 'https://www.tien-music-player.site'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
// parse cookies
app.use((0, cookie_parser_1.default)());
// for parsing content-type of application/json & application/x-www-form-urlencoded
// Increase body size limit for file uploads
app.use(express_1.default.urlencoded({ extended: true, limit: '21mb' }));
app.use(express_1.default.json({ limit: '21mb' }));
const port = env_1.default.PORT || 5000;
// global rate limiter
app.use(rate_limiter_1.rateLimiter);
app.get('/', (_, res) => {
    res.json({ message: 'Welcome to Tiếns MP3 Express Server!' });
});
// map routers to express server
app.use('/api/v1', [modules_1.userRouter, modules_1.playlistRouter, modules_1.songRouter, modules_1.artistRouter]);
// assign global middlewares to express server
app.use([middleware_1.notFoundHandlerMiddleware, middleware_1.errorInterceptor]);
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});
