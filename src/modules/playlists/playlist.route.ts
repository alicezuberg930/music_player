import express, { Request, Response } from "express"
import playlistController from "./playlist.controller"
import { JWTMiddleware } from "../../middleware/jwt.middleware"
import multer from "multer"
import { multerOptions, Options } from "../../lib/helpers/multer.options"
import { validateDtoHanlder } from "../../middleware"
import { CreatePlaylistDto } from "./dto/create-playlist.dto"
import { fileMimeAndSizeOptions } from "../../middleware/file.type.validator"
import { UpdatePlaylistDto } from "./dto/update-playlist.dto"

const playlistRouter = express.Router()

const uploadOptions: Options = {
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"] }
    }
}
const upload = multer(multerOptions(uploadOptions))
const fileValidator = fileMimeAndSizeOptions(uploadOptions)

playlistRouter.get("/playlists", (request: Request, response: Response) => playlistController.getPlaylists(request, response))

playlistRouter.post("/playlists",
    JWTMiddleware,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    fileValidator,
    validateDtoHanlder(CreatePlaylistDto),
    (request: Request, response: Response) => playlistController.createPlaylist(request, response)
)

playlistRouter.get("/playlists/:id", async (request: Request, response: Response) => {
})

playlistRouter.put("/playlists/:id",
    JWTMiddleware,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    fileValidator,
    validateDtoHanlder(UpdatePlaylistDto),
    (request: Request, response: Response) => playlistController.updatePlaylist(request, response)
)

export { playlistRouter }