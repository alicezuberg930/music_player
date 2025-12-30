import express, { Request, Response } from "express"
import playlistController from "./playlist.controller"
import multer from "multer"
import { JWTMiddleware, fileMimeAndSizeOptions, OptionalJWTMiddleware, multerOptions, Options, validateRequest } from "@yukikaze/middleware"
import { PlaylistValidators } from "@yukikaze/validator"

const playlistRouter = express.Router()

const uploadOptions: Options = {
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png", "image/webp"], exts: ["jpg", "jpeg", "png", "webp"] }
    }
}
const upload = multer(multerOptions(uploadOptions))
const fileValidator = fileMimeAndSizeOptions(uploadOptions)

playlistRouter.get("/",
    OptionalJWTMiddleware,
    (request: Request<{}, {}, {}, PlaylistValidators.QueryPlaylistParams>, response: Response) => playlistController.getPlaylists(request, response)
)

playlistRouter.post("/",
    JWTMiddleware,
    validateRequest(PlaylistValidators.createPlaylistInput),
    (request: Request<{}, {}, PlaylistValidators.CreatePlaylistInput>, response: Response) => playlistController.createPlaylist(request, response)
)

playlistRouter.get("/:id", (request: Request<{ id: string }>, response: Response) => playlistController.findPlaylist(request, response))

playlistRouter.put("/:id",
    JWTMiddleware,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    fileValidator,
    validateRequest(PlaylistValidators.updatePlaylistInput),
    (request: Request<{ id: string }, {}, PlaylistValidators.UpdatePlaylistInput>, response: Response) => playlistController.updatePlaylist(request, response)
)

playlistRouter.put("/add-songs/:id",
    JWTMiddleware,
    validateRequest(PlaylistValidators.addSongsInput),
    (request: Request<{ id: string }, {}, PlaylistValidators.AddSongsInput>, response: Response) => playlistController.addSongs(request, response)
)

playlistRouter.put("/remove-songs/:id",
    JWTMiddleware,
    validateRequest(PlaylistValidators.removeSongsInput),
    (request: Request<{ id: string }, {}, PlaylistValidators.RemoveSongsInput>, response: Response) => playlistController.removeSongs(request, response)
)

playlistRouter.delete("/:id",
    JWTMiddleware,
    (request: Request<{ id: string }, {}>, response: Response) => playlistController.deletePlaylist(request, response)
)

export { playlistRouter }