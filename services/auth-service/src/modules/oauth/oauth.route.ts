import express, { Request, Response } from "express"
import oauthController from "./oauth.controller"

const oauthAuthRoute = express.Router()

oauthAuthRoute.get("/provider/:provider",
    (request: Request<{ provider: string }>, response: Response) => oauthController.handleProvider(request, response)
)

oauthAuthRoute.get("/callback/:provider",
    (request: Request<{ provider: string }>, response: Response) => oauthController.handleCallback(request, response)
)

export { oauthAuthRoute }