import { Request, Response } from "express"
import { PlaylistService } from "./playlist.service"

class PlaylistController {
    private playlistService

    constructor() {
        this.playlistService = new PlaylistService()
    }

    public async getPlaylists(request: Request, response: Response) {
        return await this.playlistService.getPlaylists(request, response)
    }

    public async createPlaylist(request: Request, response: Response) {
        return await this.playlistService.createPlaylist(request, response)
    }

    public async updatePlaylist(request: Request, response: Response) {
        return await this.playlistService.updatePlaylist(request, response)
    }

    public async findPlaylist(request: Request, response: Response) {

    }
}

export default new PlaylistController()