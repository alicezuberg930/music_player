"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const multer_1 = __importDefault(require("multer"));
const middleware_1 = require("@yukikaze/middleware");
const create_user_dto_1 = require("./dto/create-user.dto");
const login_user_dto_1 = require("./dto/login-user.dto");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
const uploadOptions = {
    allowedFields: ["avatar"],
    allowed: {
        avatar: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"] }
    }
};
const upload = (0, multer_1.default)((0, middleware_1.multerOptions)(uploadOptions));
const fileValidator = (0, middleware_1.fileMimeAndSizeOptions)(uploadOptions);
userRouter.get("/users", (request, response) => user_controller_1.default.getUsers(request, response));
// user profile public access (wont see playlist if it's private and uploaded songs)
userRouter.get("/users/:id", (request, response) => user_controller_1.default.findUser(request, response));
// user profile only accessible when login (can see all playlist including private and uploaded songs)
userRouter.get("/me/profile", middleware_1.JWTMiddleware, (request, response) => user_controller_1.default.myProfile(request, response));
userRouter.post("/users/sign-up", (0, middleware_1.validateDtoHanlder)(create_user_dto_1.CreateUserDto), (request, response) => user_controller_1.default.signUp(request, response));
userRouter.post("/users/sign-in", (0, middleware_1.validateDtoHanlder)(login_user_dto_1.LoginUserDto), (request, response) => user_controller_1.default.signIn(request, response));
userRouter.post("/users/sign-out", middleware_1.JWTMiddleware, (request, response) => user_controller_1.default.signOut(request, response));
userRouter.put("/users/:id", upload.fields([{ name: "avatar", maxCount: 1 }]), fileValidator, (request, response) => user_controller_1.default.updateUser(request, response));
userRouter.get("/users/verify-email/:id", (request, response) => user_controller_1.default.verifyEmail(request, response));
userRouter.get("/users/song/list", middleware_1.JWTMiddleware, (request, response) => user_controller_1.default.userSongs(request, response));
userRouter.get("/users/playlist/list", middleware_1.JWTMiddleware, (request, response) => user_controller_1.default.userPlaylists(request, response));
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
userRouter.put('/users/favorite/song/:id', middleware_1.JWTMiddleware, (request, response) => user_controller_1.default.addFavoriteSong(request, response));
userRouter.delete('/users/favorite/song/:id', middleware_1.JWTMiddleware, (request, response) => user_controller_1.default.removeFavoriteSong(request, response));
userRouter.put('/users/favorite/playlist/:id', middleware_1.JWTMiddleware, (request, response) => user_controller_1.default.addFavoritePlaylist(request, response));
userRouter.delete('/users/favorite/playlist/:id', middleware_1.JWTMiddleware, (request, response) => user_controller_1.default.removeFavoritePlaylist(request, response));
