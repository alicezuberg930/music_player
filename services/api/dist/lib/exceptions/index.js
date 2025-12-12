"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpVersionNotSupportedException = exports.GatewayTimeoutException = exports.ServiceUnavailableException = exports.BadGatewayException = exports.NotImplementedException = exports.InternalServerErrorException = exports.TooManyRequestsException = exports.UnprocessableEntityException = exports.IAmATeapotException = exports.ExpectationFailedException = exports.RequestedRangeNotSatisfiableException = exports.UnsupportedMediaTypeException = exports.URITooLongException = exports.PayloadTooLargeException = exports.PreconditionFailedException = exports.LengthRequiredException = exports.GoneException = exports.ConflictException = exports.RequestTimeoutException = exports.ProxyAuthenticationRequiredException = exports.NotAcceptableException = exports.MethodNotAllowedException = exports.NotFoundException = exports.ForbiddenException = exports.PaymentRequiredException = exports.UnauthorizedException = exports.BadRequestException = exports.HttpException = void 0;
const HttpException_1 = require("./HttpException");
var HttpException_2 = require("./HttpException");
Object.defineProperty(exports, "HttpException", { enumerable: true, get: function () { return HttpException_2.HttpException; } });
class BadRequestException extends HttpException_1.HttpException {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends HttpException_1.HttpException {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class PaymentRequiredException extends HttpException_1.HttpException {
    constructor(message = "Payment Required") {
        super(message, 402);
    }
}
exports.PaymentRequiredException = PaymentRequiredException;
class ForbiddenException extends HttpException_1.HttpException {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}
exports.ForbiddenException = ForbiddenException;
class NotFoundException extends HttpException_1.HttpException {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}
exports.NotFoundException = NotFoundException;
class MethodNotAllowedException extends HttpException_1.HttpException {
    constructor(message = "Method Not Allowed") {
        super(message, 405);
    }
}
exports.MethodNotAllowedException = MethodNotAllowedException;
class NotAcceptableException extends HttpException_1.HttpException {
    constructor(message = "Not Acceptable") {
        super(message, 406);
    }
}
exports.NotAcceptableException = NotAcceptableException;
class ProxyAuthenticationRequiredException extends HttpException_1.HttpException {
    constructor(message = "Proxy Authentication Required") {
        super(message, 407);
    }
}
exports.ProxyAuthenticationRequiredException = ProxyAuthenticationRequiredException;
class RequestTimeoutException extends HttpException_1.HttpException {
    constructor(message = "Request Timeout") {
        super(message, 408);
    }
}
exports.RequestTimeoutException = RequestTimeoutException;
class ConflictException extends HttpException_1.HttpException {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}
exports.ConflictException = ConflictException;
class GoneException extends HttpException_1.HttpException {
    constructor(message = "Gone") {
        super(message, 410);
    }
}
exports.GoneException = GoneException;
class LengthRequiredException extends HttpException_1.HttpException {
    constructor(message = "Length Required") {
        super(message, 411);
    }
}
exports.LengthRequiredException = LengthRequiredException;
class PreconditionFailedException extends HttpException_1.HttpException {
    constructor(message = "Precondition Failed") {
        super(message, 412);
    }
}
exports.PreconditionFailedException = PreconditionFailedException;
class PayloadTooLargeException extends HttpException_1.HttpException {
    constructor(message = "Payload Too Large") {
        super(message, 413);
    }
}
exports.PayloadTooLargeException = PayloadTooLargeException;
class URITooLongException extends HttpException_1.HttpException {
    constructor(message = "URI Too Long") {
        super(message, 414);
    }
}
exports.URITooLongException = URITooLongException;
class UnsupportedMediaTypeException extends HttpException_1.HttpException {
    constructor(message = "Unsupported Media Type") {
        super(message, 415);
    }
}
exports.UnsupportedMediaTypeException = UnsupportedMediaTypeException;
class RequestedRangeNotSatisfiableException extends HttpException_1.HttpException {
    constructor(message = "Requested Range Not Satisfiable") {
        super(message, 416);
    }
}
exports.RequestedRangeNotSatisfiableException = RequestedRangeNotSatisfiableException;
class ExpectationFailedException extends HttpException_1.HttpException {
    constructor(message = "Expectation Failed") {
        super(message, 417);
    }
}
exports.ExpectationFailedException = ExpectationFailedException;
class IAmATeapotException extends HttpException_1.HttpException {
    constructor(message = "I'm a teapot") {
        super(message, 418);
    }
}
exports.IAmATeapotException = IAmATeapotException;
class UnprocessableEntityException extends HttpException_1.HttpException {
    constructor(message = "Unprocessable Entity") {
        super(message, 422);
    }
}
exports.UnprocessableEntityException = UnprocessableEntityException;
class TooManyRequestsException extends HttpException_1.HttpException {
    constructor(message = "Too Many Requests") {
        super(message, 429);
    }
}
exports.TooManyRequestsException = TooManyRequestsException;
class InternalServerErrorException extends HttpException_1.HttpException {
    constructor(message = "Internal Server Error") {
        super(message, 500);
    }
}
exports.InternalServerErrorException = InternalServerErrorException;
class NotImplementedException extends HttpException_1.HttpException {
    constructor(message = "Not Implemented") {
        super(message, 501);
    }
}
exports.NotImplementedException = NotImplementedException;
class BadGatewayException extends HttpException_1.HttpException {
    constructor(message = "Bad Gateway") {
        super(message, 502);
    }
}
exports.BadGatewayException = BadGatewayException;
class ServiceUnavailableException extends HttpException_1.HttpException {
    constructor(message = "Service Unavailable") {
        super(message, 503);
    }
}
exports.ServiceUnavailableException = ServiceUnavailableException;
class GatewayTimeoutException extends HttpException_1.HttpException {
    constructor(message = "Gateway Timeout") {
        super(message, 504);
    }
}
exports.GatewayTimeoutException = GatewayTimeoutException;
class HttpVersionNotSupportedException extends HttpException_1.HttpException {
    constructor(message = "HTTP Version Not Supported") {
        super(message, 505);
    }
}
exports.HttpVersionNotSupportedException = HttpVersionNotSupportedException;
