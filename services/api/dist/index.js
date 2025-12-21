"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const create_env_1 = require("@yukikaze/lib/create-env");
const middleware_1 = require("@yukikaze/middleware");
const modules_1 = require("./modules");
const exception_1 = require("@yukikaze/lib/exception");
const app = (0, express_1.default)();
app.set('trust proxy', 1);
const allowedOrigins = new Set([
    'http://localhost:5173',
    'https://tien-music-player.site',
    'https://www.tien-music-player.site'
]);
// Add response interceptor early
app.use(middleware_1.responseInterceptor);
// setup cors
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin && create_env_1.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        if (origin && allowedOrigins.has(origin)) {
            return callback(null, true);
        }
        return callback(new exception_1.UnauthorizedException(`${origin} is not allowed by CORS Policy.`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
// parse cookies
app.use((0, cookie_parser_1.default)());
// for parsing content-type of application/json & application/x-www-form-urlencoded
// Increase body size limit for file uploads
app.use(express_1.default.urlencoded({ extended: true, limit: '21mb' }));
app.use(express_1.default.json({ limit: '21mb' }));
const port = create_env_1.env.PORT || 5001;
// global rate limiter
app.use(middleware_1.rateLimiter);
app.get('/check', (_, res) => {
    res.json({ message: 'Welcome to YukikazeMP3 Express Server!' });
});
// map routers to express server
app.use('/', [modules_1.userRouter, modules_1.playlistRouter, modules_1.bannerRouter, modules_1.sitemapRouter]);
// assign global middlewares to express server
app.use([middleware_1.notFoundHandlerMiddleware, middleware_1.errorInterceptor]);
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});
