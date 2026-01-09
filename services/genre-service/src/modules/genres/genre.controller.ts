import { Request, Response } from "express"
import { GenreService } from "./genre.service"
import { GenreValidators } from "@yukikaze/validator"

class GenreController {
    private readonly genreService: GenreService

    constructor() {
        this.genreService = new GenreService()
    }

    public async getGenres(request: Request<{}, {}, {}, { search: string, type: 'tree' | 'list' }>, response: Response) {
        return await this.genreService.getGenres(request, response)
    }

    public async updateGenres(request: Request<{ id: string }, {}, GenreValidators.UpdateGenreInput>, response: Response) {
        return await this.genreService.updateGenres(request, response)
    }

    public async createGenres(request: Request<{}, {}, GenreValidators.CreateGenreInput>, response: Response) {
        return await this.genreService.createGenres(request, response)
    }
}

export default new GenreController()