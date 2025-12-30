import { Request, Response } from "express"
import { PlaylistService } from "./playlist.service"
import { PlaylistValidators } from "@yukikaze/validator"

class PlaylistController {
    private readonly playlistService: PlaylistService

    constructor() {
        this.playlistService = new PlaylistService()
    }

    public async getPlaylists(request: Request<{}, {}, {}, PlaylistValidators.QueryPlaylistParams>, response: Response) {
        return await this.playlistService.getPlaylists(request, response)
    }

    public async createPlaylist(request: Request<{}, {}, PlaylistValidators.CreatePlaylistInput>, response: Response) {
        return await this.playlistService.createPlaylist(request, response)
    }

    public async updatePlaylist(request: Request<{ id: string }, {}, PlaylistValidators.UpdatePlaylistInput>, response: Response) {
        return await this.playlistService.updatePlaylist(request, response)
    }

    public async findPlaylist(request: Request<{ id: string }>, response: Response) {
        return await this.playlistService.findPlaylist(request, response)
    }

    public async deletePlaylist(request: Request<{ id: string }, {}>, response: Response) {
        return await this.playlistService.deletePlaylist(request, response)
    }

    public async addSongs(request: Request<{ id: string }, {}, PlaylistValidators.AddSongsInput>, response: Response) {
        return await this.playlistService.addSongs(request, response)
    }

    public async removeSongs(request: Request<{ id: string }, {}, PlaylistValidators.RemoveSongsInput>, response: Response) {
        return await this.playlistService.removeSongs(request, response)
    }
}

export default new PlaylistController()