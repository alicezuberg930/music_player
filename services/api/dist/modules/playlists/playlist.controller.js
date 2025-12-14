import { PlaylistService } from "./playlist.service";
class PlaylistController {
    playlistService;
    constructor() {
        this.playlistService = new PlaylistService();
    }
    async getPlaylists(request, response) {
        return await this.playlistService.getPlaylists(request, response);
    }
    async createPlaylist(request, response) {
        return await this.playlistService.createPlaylist(request, response);
    }
    async updatePlaylist(request, response) {
        return await this.playlistService.updatePlaylist(request, response);
    }
    async findPlaylist(request, response) {
        return await this.playlistService.findPlaylist(request, response);
    }
    async deletePlaylist(request, response) {
        return await this.playlistService.deletePlaylist(request, response);
    }
    async addSongs(request, response) {
        return await this.playlistService.addSongs(request, response);
    }
    async removeSongs(request, response) {
        return await this.playlistService.removeSongs(request, response);
    }
}
export default new PlaylistController();
