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

userRouter.get("/users", (request: Request, response: Response) => userController.getUsers(request, response))

// user profile public access (wont see playlist if it's private and uploaded songs)
userRouter.get("/users/:id", (request: Request<{ id: string }>, response: Response) => userController.findUser(request, response))

// user profile only accessible when login (can see all playlist including private and uploaded songs)
userRouter.get("/me/profile",
    JWTMiddleware,
    (request: Request, response: Response) => userController.myProfile(request, response)
)

userRouter.post("/users/sign-up",
    validateDtoHanlder(CreateUserDto),
    (request: Request<{}, {}, CreateUserDto>, response: Response) => userController.signUp(request, response)
)

userRouter.post("/users/sign-in",
    validateDtoHanlder(LoginUserDto),
    (request: Request<{}, {}, LoginUserDto>, response: Response) => userController.signIn(request, response)
)

userRouter.post("/users/sign-out",
    JWTMiddleware,
    (request: Request, response: Response) => userController.signOut(request, response)
)

userRouter.put("/users/:id",
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    fileValidator,
    (request: Request<{ id: string }, {}, UpdateUserDto>, response: Response) => userController.updateUser(request, response)
)

userRouter.get("/users/verify-email/:id",
    (request: Request<{ id: string }, {}, {}, { token: string }>, response: Response) => userController.verifyEmail(request, response)
)

userRouter.get("/users/song/list",
    JWTMiddleware,
    (request: Request, response: Response) => userController.userSongs(request, response)
)

userRouter.get("/users/artist/list",
    JWTMiddleware,
    (request: Request, response: Response) => userController.userSongs(request, response)
)

userRouter.get("/users/playlist/list",
    JWTMiddleware,
    (request: Request, response: Response) => userController.userPlaylists(request, response)
)

export { userRouter }