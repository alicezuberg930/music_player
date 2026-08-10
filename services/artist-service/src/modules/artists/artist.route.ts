import express, { Request, Response } from "express"
import artistController from "./artist.controller"
import multer from "multer"
import { fileMimeAndSizeOptions, multerOptions, Options, validateRequest } from "@yukikaze/middleware"
import { createArtistInput, CreateArtistInput } from "@yukikaze/validator"

const artistRouter = express.Router()

const uploadOptions: Options = {
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png", "image/webp"], exts: ["jpg", "jpeg", "png", "webp"] }
    }
}
const upload = multer(multerOptions(uploadOptions))
const fileValidator = fileMimeAndSizeOptions(uploadOptions)

artistRouter.get("/", (request: Request, response: Response) => artistController.getArtists(request, response))

artistRouter.post("/",
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    fileValidator,
    validateRequest(createArtistInput),
    (request: Request<{}, {}, CreateArtistInput>, response: Response) => artistController.createArtist(request, response)
)

artistRouter.get("/:id", (request: Request<{ id: string }>, response: Response) => artistController.findArtist(request, response))

artistRouter.put("/:id",
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    fileValidator,
    (request: Request<{ id: string }, {}, Partial<CreateArtistInput>>, response: Response) => artistController.updateArtist(request, response)
)

artistRouter.delete("/:id", (request: Request<{ id: string }>, response: Response) => artistController.deleteArtist(request, response))

export { artistRouter }