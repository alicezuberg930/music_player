import express, { Request, Response } from "express"
import songController from "./song.controller"
import multer from "multer"
import { fileMimeAndSizeOptions, JWTMiddleware, OptionalJWTMiddleware, multerOptions, Options, validateRequest } from "@yukikaze/middleware"
import { SongValidators } from "@yukikaze/validator"

const songRouter = express.Router()

const uploadOptions: Options = {
    allowedFields: ["audio", "lyrics", "thumbnail"],
    allowed: {
        audio: { mimes: ["audio/mpeg", "audio/wav"], exts: ["mp3", "wav"], maxSize: 15 * 1024 * 1024 },
        lyrics: { mimes: ["text/plain"], exts: ["lrc", "txt"], maxSize: 1 * 1024 * 1024 },
        thumbnail: { mimes: ["image/jpeg", "image/png", "image/webp"], exts: ["jpg", "jpeg", "png", "webp"], maxSize: 4 * 1024 * 1024 },
    },
}
const upload = multer(multerOptions(uploadOptions))
const fileValidator = fileMimeAndSizeOptions(uploadOptions)

songRouter.get("/",
    OptionalJWTMiddleware,
    (request: Request<{}, {}, {}, SongValidators.QuerySongParams>, response: Response) => songController.getSongs(request, response)
)

songRouter.post("/",
    JWTMiddleware,
    upload.fields([
        { name: "audio", maxCount: 1 },
        { name: "lyrics", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    fileValidator,
    validateRequest(SongValidators.createSongInput),
    (request: Request<{}, {}, SongValidators.CreateSongInput>, response: Response) => songController.createSong(request, response)
)

songRouter.put("/:id",
    JWTMiddleware,
    upload.fields([
        { name: "audio", maxCount: 1 },
        { name: "lyrics", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    fileValidator,
    validateRequest(SongValidators.updateSongInput),
    (request: Request<{ id: string }, {}, SongValidators.UpdateSongInput>, response: Response) => songController.updateSong(request, response)
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
    (request: Request<{ id: string }, {}>, response: Response) => songController.addSongListen(request, response)
)

songRouter.get("/stream/:id",
    (request: Request<{ id: string }>, response: Response) => songController.streamSong(request, response)
)

export { songRouter }