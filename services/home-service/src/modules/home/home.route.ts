import express, { Request, Response } from "express"
import homeController from "./home.controller"
import { OptionalJWTMiddleware } from "../../middleware"

const homeRouter = express.Router()

homeRouter.get("/get",
    OptionalJWTMiddleware,
    (request: Request, response: Response) => homeController.getHome(request, response)
)

export { homeRouter }