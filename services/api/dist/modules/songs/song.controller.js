import { SongService } from "./song.service";
class SongController {
    songService;
    constructor() {
        this.songService = new SongService();
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
export default new SongController();
