"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDtoHanlder = validateDtoHanlder;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function validateDtoHanlder(DtoClass) {
    return async (req, res, next) => {
        const dtoObject = (0, class_transformer_1.plainToInstance)(DtoClass, req.body, { enableImplicitConversion: true });
        const isPartial = Boolean(DtoClass?.__partial__);
        const errors = await (0, class_validator_1.validate)(dtoObject, { whitelist: true, skipMissingProperties: isPartial });
        if (errors.length > 0) {
            return res.status(400).json({
                statusCode: 400,
                path: req.originalUrl,
                method: req.method,
                timestamp: new Date().toISOString(),
                message: "Field Validation failed",
                errors: errors.map(e => ({ ...e.constraints }))
            });
        }
        req.body = dtoObject;
        next();
    };
}
