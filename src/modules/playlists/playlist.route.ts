import express, { Request, Response } from "express";
const playlistRouter = express.Router()
import playlistController from "./playlist.controller";
import { JWTMiddleware } from "../../middleware/jwt.middleware";
import multer from "multer";
import { multerOptions } from "../../lib/helpers/multer.options";
import { validateDtoHanlder } from "../../middleware";
import { CreatePlaylistDto } from "./dto/create-playlist.dto";

const upload = multer(multerOptions({
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"] }
    }
}))

playlistRouter.get("/playlists", async (request: Request, response: Response) => {
    return await playlistController.getPlaylists(request, response)
})

playlistRouter.post("/playlists",
    JWTMiddleware,
    upload.single('thumbnail'),
    validateDtoHanlder(CreatePlaylistDto),
    async (request: Request, response: Response) => playlistController.createPlaylist(request, response)
)

playlistRouter.get("/playlists/:id", async (request: Request, response: Response) => {
    const { id } = request.params
    response.json({ id })
})

playlistRouter.put("/playlists/:id", async (request: Request, response: Response) => {
    const { id } = request.params
    response.json({ id })
})

export default playlistRouter