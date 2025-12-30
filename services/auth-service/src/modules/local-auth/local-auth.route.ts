import express, { Request, Response } from "express"
import userController from "./local-auth.controller"
import { JWTMiddleware, Options } from "@yukikaze/middleware"
import { validateRequest } from "@yukikaze/middleware"
import { AuthValidators } from "@yukikaze/validator"

const localAuthRoute = express.Router()

localAuthRoute.post("/sign-up",
    validateRequest(AuthValidators.registerInput),
    (request: Request<{}, {}, AuthValidators.RegisterInput>, response: Response) => userController.signUp(request, response)
)

localAuthRoute.post("/sign-in",
    validateRequest(AuthValidators.loginInput),
    (request: Request<{}, {}, AuthValidators.LoginInput>, response: Response) => userController.signIn(request, response)
)

localAuthRoute.post("/sign-out",
    JWTMiddleware,
    (request: Request, response: Response) => userController.signOut(request, response)
)

export { localAuthRoute }