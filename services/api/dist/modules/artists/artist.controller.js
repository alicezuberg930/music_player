"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const artist_service_1 = require("./artist.service");
class ArtistController {
    constructor() {
        this.artistService = new artist_service_1.ArtistService();
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
exports.default = new ArtistController();
