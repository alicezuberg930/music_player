import express, { Request, Response } from "express"
import userController from "./user.controller"
import multer from "multer"
import { validateDtoHanlder, fileMimeAndSizeOptions, JWTMiddleware, multerOptions, Options } from "@yukikaze/middleware"
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

userRouter.post("/sign-up",
    validateDtoHanlder(CreateUserDto),
    (request: Request<{}, {}, CreateUserDto>, response: Response) => userController.signUp(request, response)
)

userRouter.post("/sign-in",
    validateDtoHanlder(LoginUserDto),
    (request: Request<{}, {}, LoginUserDto>, response: Response) => userController.signIn(request, response)
)

userRouter.post("/sign-out",
    JWTMiddleware,
    (request: Request, response: Response) => userController.signOut(request, response)
)

// auth above

userRouter.get("/", (request: Request, response: Response) => userController.getUsers(request, response))

// user public profile, anyone can see (cannot see private playlists/songs & followed artists)
userRouter.get("/:id", (request: Request<{ id: string }>, response: Response) => userController.findUser(request, response))

// user private profile, only accessible when login
userRouter.get("/me/profile",
    JWTMiddleware,
    (request: Request, response: Response) => userController.myProfile(request, response)
)

// update user profile
userRouter.put("/:id",
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    fileValidator,
    (request: Request<{ id: string }, {}, UpdateUserDto>, response: Response) => userController.updateUser(request, response)
)

userRouter.get("/verify-email/:id",
    (request: Request<{ id: string }, {}, {}, { token: string }>, response: Response) => userController.verifyEmail(request, response)
)

userRouter.get("/song/list",
    JWTMiddleware,
    (request: Request<{}, {}, {}, { type: 'upload' | 'favorite' }>, response: Response) => userController.userSongs(request, response)
)

userRouter.get("/playlist/list",
    JWTMiddleware,
    (request: Request<{}, {}, {}, { type: 'upload' | 'favorite' }>, response: Response) => userController.userPlaylists(request, response)
)

userRouter.get("/artist/list",
    JWTMiddleware,
    (request: Request, response: Response) => userController.userArtists(request, response)
)

userRouter.put('/favorite/song/:id',
    JWTMiddleware,
    (request: Request<{ id: string }>, response: Response) => userController.toggleFavoriteSong(request, response)
)

userRouter.put('/favorite/playlist/:id',
    JWTMiddleware,
    (request: Request<{ id: string }>, response: Response) => userController.toggleFavoritePlaylist(request, response)
)

userRouter.put("/follow/artist/:id",
    JWTMiddleware,
    (request: Request<{ id: string }>, response: Response) => userController.toggleFollowArtist(request, response)
)

export { userRouter }