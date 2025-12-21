import express, { Request, Response } from "express"
import userController from "./local-auth.controller"
import multer from "multer"
import { validateDtoHanlder, fileMimeAndSizeOptions, JWTMiddleware, multerOptions, Options } from "@yukikaze/middleware"
import { CreateUserDto } from "./dto/create-user.dto"
import { LoginUserDto } from "./dto/login-user.dto"

const localAuthRoute = express.Router()

const uploadOptions: Options = {
    allowedFields: ["avatar"],
    allowed: {
        avatar: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"] }
    }
}
const upload = multer(multerOptions(uploadOptions))
const fileValidator = fileMimeAndSizeOptions(uploadOptions)

localAuthRoute.post("/sign-up",
    validateDtoHanlder(CreateUserDto),
    (request: Request<{}, {}, CreateUserDto>, response: Response) => userController.signUp(request, response)
)

localAuthRoute.post("/sign-in",
    validateDtoHanlder(LoginUserDto),
    (request: Request<{}, {}, LoginUserDto>, response: Response) => userController.signIn(request, response)
)

localAuthRoute.post("/sign-out",
    JWTMiddleware,
    (request: Request, response: Response) => userController.signOut(request, response)
)

export { localAuthRoute }