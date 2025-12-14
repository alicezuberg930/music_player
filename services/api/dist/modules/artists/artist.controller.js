import { ArtistService } from "./artist.service";
class ArtistController {
    artistService;
    constructor() {
        this.artistService = new ArtistService();
    }
    async getArtists(request, response) {
        return await this.artistService.getArtists(request, response);
    }
    async createArtist(request, response) {
        return await this.artistService.createArtist(request, response);
    }
    async updateArtist(request, response) {
        return await this.artistService.updateArtist(request, response);
    }
    async findArtist(request, response) {
        return await this.artistService.findArtist(request, response);
    }
}
export default new ArtistController();
