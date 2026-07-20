import express, { Request, Response } from "express"
import videoController from "./video.controller"
import multer from "multer"
import { fileMimeAndSizeOptions, JWTMiddleware, OptionalJWTMiddleware, multerOptions, Options, validateRequest } from "@yukikaze/middleware"
import { VideoValidators } from "@yukikaze/validator"

const videoRouter = express.Router()

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

videoRouter.get("/",
    OptionalJWTMiddleware,
    (request: Request<{}, {}, {}, VideoValidators.QueryVideoParams>, response: Response) => videoController.getVideos(request, response)
)

videoRouter.post("/",
    JWTMiddleware,
    upload.fields([
        { name: "audio", maxCount: 1 },
        { name: "lyrics", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    fileValidator,
    validateRequest(VideoValidators.createVideoInput),
    (request: Request<{}, {}, VideoValidators.CreateVideoInput>, response: Response) => videoController.createVideo(request, response)
)

videoRouter.put("/:id",
    JWTMiddleware,
    upload.fields([
        { name: "audio", maxCount: 1 },
        { name: "lyrics", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    fileValidator,
    validateRequest(VideoValidators.updateVideoInput),
    (request: Request<{ id: string }, {}, VideoValidators.UpdateVideoInput>, response: Response) => videoController.updateVideo(request, response)
)

videoRouter.get("/:id",
    OptionalJWTMiddleware,
    (request: Request<{ id: string }>, response: Response) => videoController.findVideo(request, response)
)

videoRouter.delete("/:id",
    JWTMiddleware,
    (request: Request<{ id: string }, {}>, response: Response) => videoController.deleteVideo(request, response)
)

videoRouter.put("/listens/add/:id",
    (request: Request<{ id: string }, {}>, response: Response) => videoController.addVideoView(request, response)
)

videoRouter.get("/stream/:id",
    (request: Request<{ id: string }>, response: Response) => videoController.streamVideo(request, response)
)

export { videoRouter }