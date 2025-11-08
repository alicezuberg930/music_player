import { Request, Response } from "express"
import { ArtistService } from "./artist.service"

class ArtistController {
    private artistService

    constructor() {
        this.artistService = new ArtistService()
    }

    public async getArtists(request: Request, response: Response) {
        return await this.artistService.getArtists(request, response)
    }

    public async createArtist(request: Request, response: Response) {
        return await this.artistService.createArtist(request, response)
    }

    public async findArtist(request: Request, response: Response) {

    }
}

export default new ArtistController()