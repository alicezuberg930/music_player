import express, { Request, Response } from "express"
import homeController from "./home.controller"
import { OptionalJWTMiddleware } from "@yukikaze/middleware"

const homeRouter = express.Router()

homeRouter.get("/get",
    OptionalJWTMiddleware,
    (request: Request, response: Response) => homeController.getHome(request, response)
)

homeRouter.get("/rankings",
    (request: Request, response: Response) => homeController.rankings(request, response)
)

export { homeRouter }