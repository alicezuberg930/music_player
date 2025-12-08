"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.songRouter = void 0;
const express_1 = __importDefault(require("express"));
const song_controller_1 = __importDefault(require("./song.controller"));
const create_song_dto_1 = require("./dto/create-song.dto");
const multer_1 = __importDefault(require("multer"));
const multer_options_1 = require("../../lib/helpers/multer.options");
const update_song_dto_1 = require("./dto/update-song.dto");
const middleware_1 = require("../../middleware");
const songRouter = express_1.default.Router();
exports.songRouter = songRouter;
const uploadOptions = {
    allowedFields: ["audio", "lyrics", "thumbnail"],
    allowed: {
        audio: { mimes: ["audio/mpeg", "audio/wav"], exts: ["mp3", "wav"], maxSize: 15 * 1024 * 1024 },
        lyrics: { mimes: ["text/plain"], exts: ["lrc", "txt"], maxSize: 1 * 1024 * 1024 },
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"], maxSize: 4 * 1024 * 1024 },
    },
};
const upload = (0, multer_1.default)((0, multer_options_1.multerOptions)(uploadOptions));
const fileValidator = (0, middleware_1.fileMimeAndSizeOptions)(uploadOptions);
songRouter.get("/songs", middleware_1.OptionalJWTMiddleware, (request, response) => song_controller_1.default.getSongs(request, response));
songRouter.post("/songs", middleware_1.JWTMiddleware, upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "lyrics", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), fileValidator, (0, middleware_1.validateDtoHanlder)(create_song_dto_1.CreateSongDto), (request, response) => song_controller_1.default.createSong(request, response));
songRouter.put("/songs/:id", middleware_1.JWTMiddleware, upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "lyrics", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), fileValidator, (0, middleware_1.validateDtoHanlder)(update_song_dto_1.UpdateSongDto), (request, response) => song_controller_1.default.updateSong(request, response));
songRouter.get("/songs/:id", middleware_1.OptionalJWTMiddleware, (request, response) => song_controller_1.default.findSong(request, response));
songRouter.delete("/songs/:id", middleware_1.JWTMiddleware, (request, response) => song_controller_1.default.deleteSong(request, response));
