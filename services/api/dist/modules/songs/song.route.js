import express from "express";
import songController from "./song.controller";
import { CreateSongDto } from "./dto/create-song.dto";
import multer from "multer";
import { multerOptions } from "../../lib/helpers/multer.options";
import { UpdateSongDto } from "./dto/update-song.dto";
import { fileMimeAndSizeOptions, validateDtoHanlder, JWTMiddleware, OptionalJWTMiddleware } from "../../middleware";
const songRouter = express.Router();
const uploadOptions = {
    allowedFields: ["audio", "lyrics", "thumbnail"],
    allowed: {
        audio: { mimes: ["audio/mpeg", "audio/wav"], exts: ["mp3", "wav"], maxSize: 15 * 1024 * 1024 },
        lyrics: { mimes: ["text/plain"], exts: ["lrc", "txt"], maxSize: 1 * 1024 * 1024 },
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"], maxSize: 4 * 1024 * 1024 },
    },
};
const upload = multer(multerOptions(uploadOptions));
const fileValidator = fileMimeAndSizeOptions(uploadOptions);
songRouter.get("/songs", OptionalJWTMiddleware, (request, response) => songController.getSongs(request, response));
songRouter.post("/songs", JWTMiddleware, upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "lyrics", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), fileValidator, validateDtoHanlder(CreateSongDto), (request, response) => songController.createSong(request, response));
songRouter.put("/songs/:id", JWTMiddleware, upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "lyrics", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), fileValidator, validateDtoHanlder(UpdateSongDto), (request, response) => songController.updateSong(request, response));
songRouter.get("/songs/:id", OptionalJWTMiddleware, (request, response) => songController.findSong(request, response));
songRouter.delete("/songs/:id", JWTMiddleware, (request, response) => songController.deleteSong(request, response));
export { songRouter };
