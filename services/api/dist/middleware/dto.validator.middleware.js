import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
export function validateDtoHanlder(DtoClass) {
    return async (req, res, next) => {
        const dtoObject = plainToInstance(DtoClass, req.body, { enableImplicitConversion: true });
        const isPartial = Boolean(DtoClass?.__partial__);
        const errors = await validate(dtoObject, { whitelist: true, skipMissingProperties: isPartial });
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
