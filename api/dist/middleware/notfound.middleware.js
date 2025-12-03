"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandlerMiddleware = notFoundHandlerMiddleware;
const exceptions_1 = require("../lib/exceptions");
function notFoundHandlerMiddleware(req, _res, next) {
    next(new exceptions_1.NotFoundException(`Route or Method not found. Cannot ${req.method} ${req.originalUrl}`));
}
