"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const song_service_1 = require("./song.service");
class SongController {
    constructor() {
        this.songService = new song_service_1.SongService();
    }
    async getSongs(request, response) {
        return await this.songService.getSongs(request, response);
    }
    async createSong(request, response) {
        return await this.songService.createSong(request, response);
    }
    async updateSong(request, response) {
        return await this.songService.updateSong(request, response);
    }
    async findSong(request, response) {
        return await this.songService.findSong(request, response);
    }
    async deleteSong(request, response) {
        return await this.songService.deleteSong(request, response);
    }
}
exports.default = new SongController();
