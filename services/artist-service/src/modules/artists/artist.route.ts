import express, { Request, Response } from "express"
import artistController from "./artist.controller"
import multer from "multer"
import { validateDtoHanlder, fileMimeAndSizeOptions, multerOptions, Options, JWTMiddleware } from "@yukikaze/middleware"
import { CreateArtistDto } from "./dto/create-artist.dto"
import { UpdateArtistDto } from "./dto/update-artist.dto"

const artistRouter = express.Router()

const uploadOptions: Options = {
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"] }
    }
}
const upload = multer(multerOptions(uploadOptions))
const fileValidator = fileMimeAndSizeOptions(uploadOptions)

artistRouter.get("/", (request: Request, response: Response) => artistController.getArtists(request, response))

artistRouter.post("/",
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    fileValidator,
    validateDtoHanlder(CreateArtistDto),
    (request: Request<{}, {}, CreateArtistDto>, response: Response) => artistController.createArtist(request, response)
)

artistRouter.get("/:id", (request: Request<{ id: string }>, response: Response) => artistController.findArtist(request, response))

artistRouter.put("/:id",
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    fileValidator,
    validateDtoHanlder(UpdateArtistDto),
    (request: Request<{ id: string }, {}, UpdateArtistDto>, response: Response) => artistController.updateArtist(request, response)
)

artistRouter.delete("/:id", (request: Request<{ id: string }>, response: Response) => artistController.deleteArtist(request, response))

artistRouter.put("/follow/:id",
    JWTMiddleware,
    (request: Request<{ id: string }>, response: Response) => artistController.toggleFollowArtist(request, response)
)

export { artistRouter }