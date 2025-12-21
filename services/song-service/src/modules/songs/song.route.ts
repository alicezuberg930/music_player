import express, { Request, Response } from "express"
import songController from "./song.controller"
import { CreateSongDto } from "./dto/create-song.dto"
import multer from "multer"
import { UpdateSongDto } from "./dto/update-song.dto"
import { fileMimeAndSizeOptions, validateDtoHanlder, JWTMiddleware, OptionalJWTMiddleware, multerOptions, Options } from "@yukikaze/middleware"
import { QueryParams } from "./dto/query.param"

const songRouter = express.Router()

const uploadOptions: Options = {
    allowedFields: ["audio", "lyrics", "thumbnail"],
    allowed: {
        audio: { mimes: ["audio/mpeg", "audio/wav"], exts: ["mp3", "wav"], maxSize: 15 * 1024 * 1024 },
        lyrics: { mimes: ["text/plain"], exts: ["lrc", "txt"], maxSize: 1 * 1024 * 1024 },
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"], maxSize: 4 * 1024 * 1024 },
    },
}
const upload = multer(multerOptions(uploadOptions))
const fileValidator = fileMimeAndSizeOptions(uploadOptions)

songRouter.get("/",
    OptionalJWTMiddleware,
    (request: Request<{}, {}, {}, QueryParams>, response: Response) => songController.getSongs(request, response)
)

songRouter.post("/",
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

songRouter.put("/:id",
    JWTMiddleware,
    upload.fields([
        { name: "audio", maxCount: 1 },
        { name: "lyrics", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    fileValidator,
    validateDtoHanlder(UpdateSongDto),
    (request: Request<{ id: string }, {}, UpdateSongDto>, response: Response) => songController.updateSong(request, response)
)

songRouter.get("/:id",
    OptionalJWTMiddleware,
    (request: Request<{ id: string }>, response: Response) => songController.findSong(request, response)
)

songRouter.delete("/:id",
    JWTMiddleware,
    (request: Request<{ id: string }, {}>, response: Response) => songController.deleteSong(request, response)
)

songRouter.put("/listens/add/:id",
    JWTMiddleware,
    (request: Request<{ id: string }, {}>, response: Response) => songController.addSongListen(request, response)
)

export { songRouter }