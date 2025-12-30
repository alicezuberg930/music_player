import { Request, Response } from "express"
import { ArtistService } from "./artist.service"
import { ArtistValidators } from "@yukikaze/validator"

class ArtistController {
    private readonly artistService: ArtistService

    constructor() {
        this.artistService = new ArtistService()
    }

    public async getArtists(request: Request, response: Response) {
        return await this.artistService.getArtists(request, response)
    }

    public async createArtist(request: Request<{}, {}, ArtistValidators.CreateArtistInput>, response: Response) {
        return await this.artistService.createArtist(request, response)
    }

    public async updateArtist(request: Request<{ id: string }, {}, Partial<ArtistValidators.CreateArtistInput>>, response: Response) {
        return await this.artistService.updateArtist(request, response)
    }

    public async findArtist(request: Request<{ id: string }>, response: Response) {
        return await this.artistService.findArtist(request, response)
    }

    public async deleteArtist(request: Request<{ id: string }>, response: Response) {
        return await this.artistService.deleteArtist(request, response)
    }
}

export default new ArtistController()