import express, { Request, Response } from "express"
import playlistController from "./playlist.controller"
import multer from "multer"
import { multerOptions, Options } from "../../lib/helpers/multer.options"
import { validateDtoHanlder, JWTMiddleware, fileMimeAndSizeOptions } from "../../middleware"
import { CreatePlaylistDto } from "./dto/create-playlist.dto"
import { UpdatePlaylistDto } from "./dto/update-playlist.dto"
import { QueryPlaylistDto } from "./dto/query-playlist.dto"

const playlistRouter = express.Router()

const uploadOptions: Options = {
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"] }
    }
}
const upload = multer(multerOptions(uploadOptions))
const fileValidator = fileMimeAndSizeOptions(uploadOptions)

playlistRouter.get("/playlists",
    (request: Request<{}, {}, {}, QueryPlaylistDto>, response: Response) => playlistController.getPlaylists(request, response)
)

playlistRouter.post("/playlists",
    JWTMiddleware,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    fileValidator,
    validateDtoHanlder(CreatePlaylistDto),
    (request: Request<{}, {}, CreatePlaylistDto>, response: Response) => playlistController.createPlaylist(request, response)
)

playlistRouter.get("/playlists/:id", (request: Request<{ id: string }>, response: Response) => playlistController.findPlaylist(request, response))

playlistRouter.put("/playlists/:id",
    JWTMiddleware,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    fileValidator,
    validateDtoHanlder(UpdatePlaylistDto),
    (request: Request<{ id: string }, {}, UpdatePlaylistDto>, response: Response) => playlistController.updatePlaylist(request, response)
)

playlistRouter.delete("/playlists/:id",
    JWTMiddleware,
    (request: Request<{ id: string }, {}>, response: Response) => playlistController.deletePlaylist(request, response)
)



export { playlistRouter }