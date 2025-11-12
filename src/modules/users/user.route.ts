import express, { Request, Response } from "express"
import userController from "./user.controller"
import { multerOptions, Options } from "../../lib/helpers/multer.options"
import multer from "multer"
import { validateDtoHanlder, fileMimeAndSizeOptions, JWTMiddleware } from "../../middleware"
import { CreateUserDto } from "./dto/create-user.dto"
import { LoginUserDto } from "./dto/login-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"

const userRouter = express.Router()

const uploadOptions: Options = {
    allowedFields: ["avatar"],
    allowed: {
        avatar: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"] }
    }
}
const upload = multer(multerOptions(uploadOptions))
const fileValidator = fileMimeAndSizeOptions(uploadOptions)

// user profile public access (wont see playlist if it's private and uploaded songs)
userRouter.get("/users/:id",
    (request: Request<{ id: string }>, response: Response) => userController.findUser(request, response)
)

// user profile only accessible when login (can see all playlist including private and uploaded songs)
userRouter.get("/users/profile",
    JWTMiddleware,
    (request: Request<{ id: string }>, response: Response) => userController.findMyProfile(request, response)
)

userRouter.post("/users/register",
    JWTMiddleware,
    validateDtoHanlder(CreateUserDto),
    (request: Request<{}, {}, CreateUserDto>, response: Response) => userController.registerUser(request, response)
)

userRouter.post("/users/login",
    JWTMiddleware,
    validateDtoHanlder(LoginUserDto),
    (request: Request<{}, {}, LoginUserDto>, response: Response) => userController.loginUser(request, response)
)

userRouter.put("/users/:id",
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    fileValidator,
    (request: Request<{ id: string }, {}, UpdateUserDto>, response: Response) => userController.updateUser(request, response)
)

export { userRouter }