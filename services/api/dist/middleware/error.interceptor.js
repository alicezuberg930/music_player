"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorInterceptor = errorInterceptor;
const exception_1 = require("@yukikaze/lib/exception");
const multer_1 = require("multer");
const create_env_1 = require("@yukikaze/lib/create-env");
function errorInterceptor(err, req, res, _next) {
    let status = 500;
    let message = "Internal Server Error";
    if (err instanceof exception_1.HttpException) {
        status = err.status;
        message = err.message;
    }
    if (err instanceof multer_1.MulterError) {
        status = 400;
        message = err.message;
    }
    const errorResponse = {
        statusCode: status,
        message,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        ...create_env_1.env.NODE_ENV !== 'production' && { stack: err.stack }
    };
    res.status(status).json(errorResponse);
}
