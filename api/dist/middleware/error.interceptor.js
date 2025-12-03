"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorInterceptor = errorInterceptor;
const HttpException_1 = require("../lib/exceptions/HttpException");
const multer_1 = require("multer");
const env_1 = __importDefault(require("../lib/helpers/env"));
function errorInterceptor(err, req, res, _next) {
    let status = 500;
    let message = "Internal Server Error";
    if (err instanceof HttpException_1.HttpException) {
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
        ...env_1.default.NODE_ENV !== 'production' && { stack: err.stack }
    };
    res.status(status).json(errorResponse);
}
