"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandlerMiddleware = notFoundHandlerMiddleware;
const exception_1 = require("@yukikaze/lib/exception");
function notFoundHandlerMiddleware(req, _res, next) {
    next(new exception_1.NotFoundException(`Route or Method not found. Cannot ${req.method} ${req.originalUrl}`));
}
