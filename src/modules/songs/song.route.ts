import express, { Request, Response } from "express";
const songRouter = express.Router()
import songController from "./song.controller";
import { validateDtoHanlder } from "../../middleware/dto.validator.middleware";
import { CreateSongDto } from "./dto/create-song.dto";
import multer from "multer";
import { multerOptions } from "../../lib/helpers/multer.options";
import { JWTMiddleware } from "../../middleware/jwt.middleware";
import { UpdateSongDto } from "./dto/update-song.dto";

const upload = multer(multerOptions({
    allowedFields: ["audio", "lyrics"],
    allowed: {
        audio: { mimes: ["audio/mpeg", "audio/wav"], exts: ["mp3", "wav"] },
        lyrics: { mimes: ["text/plain"], exts: ["lrc", "txt"] },
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"] }
    }
}))

songRouter.get("/songs", async (request: Request, response: Response) => {
    await songController.getSongs(request, response)
})

songRouter.post("/songs",
    // JWTMiddleware,
    upload.fields([
        { name: "audio", maxCount: 1 },
        { name: "lyrics", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    validateDtoHanlder(CreateSongDto),
    async (request: Request, response: Response) => await songController.createSong(request, response)
)

songRouter.get("/songs/:id",
    // JWTMiddleware
    upload.none(),
    validateDtoHanlder(UpdateSongDto),
    async (request: Request, response: Response) => await songController.findSong(request, response)
)

songRouter.put("/songs/:id", async (request: Request, response: Response) => {
    const { id } = request.params
    response.json({ id })
})

export default songRouter