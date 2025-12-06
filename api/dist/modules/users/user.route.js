"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const multer_options_1 = require("../../lib/helpers/multer.options");
const multer_1 = __importDefault(require("multer"));
const middleware_1 = require("../../middleware");
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
const upload = (0, multer_1.default)((0, multer_options_1.multerOptions)(uploadOptions));
const fileValidator = (0, middleware_1.fileMimeAndSizeOptions)(uploadOptions);
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
userRouter.get("/users/artist/list", middleware_1.JWTMiddleware, (request, response) => user_controller_1.default.userSongs(request, response));
userRouter.get("/users/playlist/list", middleware_1.JWTMiddleware, (request, response) => user_controller_1.default.userSongs(request, response));
