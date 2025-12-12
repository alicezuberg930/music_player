"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playlist_service_1 = require("./playlist.service");
class PlaylistController {
    constructor() {
        this.playlistService = new playlist_service_1.PlaylistService();
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
exports.default = new PlaylistController();
