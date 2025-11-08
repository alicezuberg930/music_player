import express, { Request, Response } from "express"
import artistController from "./artist.controller"
import { JWTMiddleware } from "../../middleware/jwt.middleware"
import multer from "multer"
import { multerOptions } from "../../lib/helpers/multer.options"
import { validateDtoHanlder } from "../../middleware"
import { CreateArtistDto } from "./dto/create-artist.dto"

const upload = multer(multerOptions({
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"] }
    }
}))

const artistRouter = express.Router()

artistRouter.get("/artists", async (request: Request, response: Response) => {
    return await artistController.getArtists(request, response)
})

artistRouter.post("/artists",
    JWTMiddleware,
    upload.single('thumbnail'),
    validateDtoHanlder(CreateArtistDto),
    async (request: Request, response: Response) => artistController.createArtist(request, response)
)

artistRouter.get("/artists/:id", async (request: Request, response: Response) => {
    const { id } = request.params
    response.json({ id })
})

artistRouter.put("/artists/:id", async (request: Request, response: Response) => {
    const { id } = request.params
    response.json({ id })
})

export { artistRouter }