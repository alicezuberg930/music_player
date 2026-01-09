import express, { Request, Response } from "express"
import genreController from "./genre.controller"
import { validateRequest } from "@yukikaze/middleware"
import { GenreValidators } from "@yukikaze/validator"

const genreRouter = express.Router()

genreRouter.get("/",
    (request: Request<{}, {}, {}, { search: string, type: 'tree' | 'list' }>, response: Response) => genreController.getGenres(request, response)
)

genreRouter.put("/:id",
    validateRequest(GenreValidators.updateGenreInput),
    (request: Request<{ id: string }, {}, GenreValidators.UpdateGenreInput>, response: Response) => genreController.updateGenres(request, response)
)

genreRouter.post("/",
    validateRequest(GenreValidators.createGenreInput),
    (request: Request<{}, {}, GenreValidators.CreateGenreInput>, response: Response) => genreController.createGenres(request, response)
)

export { genreRouter }