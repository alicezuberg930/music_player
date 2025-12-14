import express from "express";
import userController from "./user.controller";
import { multerOptions } from "../../lib/helpers/multer.options";
import multer from "multer";
import { validateDtoHanlder, fileMimeAndSizeOptions, JWTMiddleware } from "../../middleware";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
const userRouter = express.Router();
const uploadOptions = {
    allowedFields: ["avatar"],
    allowed: {
        avatar: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"] }
    }
};
const upload = multer(multerOptions(uploadOptions));
const fileValidator = fileMimeAndSizeOptions(uploadOptions);
userRouter.get("/users", (request, response) => userController.getUsers(request, response));
// user profile public access (wont see playlist if it's private and uploaded songs)
userRouter.get("/users/:id", (request, response) => userController.findUser(request, response));
// user profile only accessible when login (can see all playlist including private and uploaded songs)
userRouter.get("/me/profile", JWTMiddleware, (request, response) => userController.myProfile(request, response));
userRouter.post("/users/sign-up", validateDtoHanlder(CreateUserDto), (request, response) => userController.signUp(request, response));
userRouter.post("/users/sign-in", validateDtoHanlder(LoginUserDto), (request, response) => userController.signIn(request, response));
userRouter.post("/users/sign-out", JWTMiddleware, (request, response) => userController.signOut(request, response));
userRouter.put("/users/:id", upload.fields([{ name: "avatar", maxCount: 1 }]), fileValidator, (request, response) => userController.updateUser(request, response));
userRouter.get("/users/verify-email/:id", (request, response) => userController.verifyEmail(request, response));
userRouter.get("/users/song/list", JWTMiddleware, (request, response) => userController.userSongs(request, response));
userRouter.get("/users/playlist/list", JWTMiddleware, (request, response) => userController.userPlaylists(request, response));
// following artist list
// userRouter.get("/users/artist/follow",
//     JWTMiddleware,
//     (request: Request, response: Response) => userController.followingArtistList(request, response)
// )
// follow artist
// userRouter.put("/users/artist/follow/:id",
//     JWTMiddleware,
//     (request: Request, response: Response) => userController.followArtist(request, response)
// )
// unfollow artist
// userRouter.delete("/users/artist/follow/:id",
//     JWTMiddleware,
//     (request: Request, response: Response) => userController.unfollowArtist(request, response)
// )
userRouter.put('/users/favorite/song/:id', JWTMiddleware, (request, response) => userController.addFavoriteSong(request, response));
userRouter.delete('/users/favorite/song/:id', JWTMiddleware, (request, response) => userController.removeFavoriteSong(request, response));
userRouter.put('/users/favorite/playlist/:id', JWTMiddleware, (request, response) => userController.addFavoritePlaylist(request, response));
userRouter.delete('/users/favorite/playlist/:id', JWTMiddleware, (request, response) => userController.removeFavoritePlaylist(request, response));
export { userRouter };
