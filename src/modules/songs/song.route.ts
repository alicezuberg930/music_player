import express, { Request, Response } from "express";
const songRouter = express.Router()
import songController from "./song.controller";
import { validateDtoHanlder } from "../../middleware/dto.validator.middleware";
import { CreateSongDto } from "./create-song.dto";
import multer from "multer";
import { multerOptions } from "../../lib/helpers/multer.options";

const upload = multer(multerOptions({ allowedFields: ["stream", "lyrics"] }))

songRouter.get("/songs", async (request: Request, response: Response) => {
    await songController.getSongs(request, response)
})

songRouter.post("/songs",
    upload.fields([{ name: "stream", maxCount: 1 }, { name: "lyrics", maxCount: 1 }]),
    validateDtoHanlder(CreateSongDto),
    async (request: Request, response: Response) => await songController.createSong(request, response)
)

songRouter.get("/songs/:id", async (request: Request, response: Response) => {
    await songController.findSong(request, response)
})

songRouter.put("/songs/:id", async (request: Request, response: Response) => {
    const { id } = request.params
    response.json({ id })
})

export default songRouter