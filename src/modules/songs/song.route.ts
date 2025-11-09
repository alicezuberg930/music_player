import express, { Request, Response } from "express"
import songController from "./song.controller"
import { validateDtoHanlder } from "../../middleware/dto.validator.middleware"
import { CreateSongDto } from "./dto/create-song.dto"
import multer from "multer"
import { multerOptions, Options } from "../../lib/helpers/multer.options"
import { JWTMiddleware } from "../../middleware/jwt.middleware"
import { UpdateSongDto } from "./dto/update-song.dto"
import { fileMimeAndSizeOptions } from "../../middleware/file.type.validator"

const songRouter = express.Router()

const uploadOptions: Options = {
    allowedFields: ["audio", "lyrics", "thumbnail"],
    allowed: {
        audio: { mimes: ["audio/mpeg", "audio/wav"], exts: ["mp3", "wav"], maxSize: 15 * 1024 * 1024 },
        lyrics: { mimes: ["text/plain"], exts: ["lrc", "txt"], maxSize: 2 * 1024 * 1024 },
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"], maxSize: 5 * 1024 * 1024 },
    },
}
const upload = multer(multerOptions(uploadOptions))
const fileValidator = fileMimeAndSizeOptions(uploadOptions)

songRouter.get("/songs", async (request: Request, response: Response) => await songController.getSongs(request, response))

songRouter.post("/songs",
    JWTMiddleware,
    upload.fields([
        { name: "audio", maxCount: 1 },
        { name: "lyrics", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    fileValidator,
    validateDtoHanlder(CreateSongDto),
    (request: Request<{}, {}, CreateSongDto>, response: Response) => songController.createSong(request, response)
)

songRouter.get("/songs/:id",
    upload.none(),
    validateDtoHanlder(UpdateSongDto),
    (request: Request, response: Response) => songController.findSong(request, response)
)

songRouter.put("/songs/:id", async (request: Request, response: Response) => {
    const { id } = request.params
    response.json({ id })
})

export { songRouter }