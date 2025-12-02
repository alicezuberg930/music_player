import { Request, Response } from "express"
import { ArtistService } from "./artist.service"
import { UpdateArtistDto } from "./dto/update-artist.dto"
import { CreateArtistDto } from "./dto/create-artist.dto"

class ArtistController {
    private readonly artistService

    constructor() {
        this.artistService = new ArtistService()
    }

    public async getArtists(request: Request, response: Response) {
        return await this.artistService.getArtists(request, response)
    }

    public async createArtist(request: Request<{}, {}, CreateArtistDto>, response: Response) {
        return await this.artistService.createArtist(request, response)
    }

    public async updateArtist(request: Request<{ id: string }, {}, UpdateArtistDto>, response: Response) {
        return await this.artistService.updateArtist(request, response)
    }

    public async findArtist(request: Request<{ id: string }>, response: Response) {
        return await this.artistService.findArtist(request, response)
    }
}

export default new ArtistController()