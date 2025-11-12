import { Request, Response } from "express"
import { PlaylistService } from "./playlist.service"
import { UpdatePlaylistDto } from "./dto/update-playlist.dto"
import { CreatePlaylistDto } from "./dto/create-playlist.dto"
import { QueryPlaylistDto } from "./dto/query-playlist.dto"

class PlaylistController {
    private playlistService

    constructor() {
        this.playlistService = new PlaylistService()
    }

    public async getPlaylists(request: Request<{}, {}, {}, QueryPlaylistDto>, response: Response) {
        return await this.playlistService.getPlaylists(request, response)
    }

    public async createPlaylist(request: Request<{}, {}, CreatePlaylistDto>, response: Response) {
        return await this.playlistService.createPlaylist(request, response)
    }

    public async updatePlaylist(request: Request<{ id: string }, {}, UpdatePlaylistDto>, response: Response) {
        return await this.playlistService.updatePlaylist(request, response)
    }

    public async findPlaylist(request: Request<{ id: string }>, response: Response) {
        return await this.playlistService.findPlaylist(request, response)
    }
}

export default new PlaylistController()