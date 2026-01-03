import express, { Request, Response } from "express"
import { JWTMiddleware, Options } from "@yukikaze/middleware"
import { validateRequest } from "@yukikaze/middleware"
import { AuthValidators } from "@yukikaze/validator"
import oauthController from "./oauth.controller"

const oauthAuthRoute = express.Router()

oauthAuthRoute.get("/provider/:provider",
    validateRequest(AuthValidators.registerInput),
    (request: Request<{ provider: string }>, response: Response) => oauthController.handleProvider(request, response)
)

export { oauthAuthRoute }