import { NotFoundException } from '@yukikaze/lib/exception';
export function notFoundHandlerMiddleware(req, _res, next) {
    next(new NotFoundException(`Route or Method not found. Cannot ${req.method} ${req.originalUrl}`));
}
