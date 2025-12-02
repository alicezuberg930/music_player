import { Request, Response } from "express"
import { PlaylistService } from "./playlist.service"
import { UpdatePlaylistDto } from "./dto/update-playlist.dto"
import { CreatePlaylistDto } from "./dto/create-playlist.dto"
import { QueryPlaylistDto } from "./dto/query-playlist.dto"
import { PlaylistSongDto } from "./dto/playlist-songs.dto"

class PlaylistController {
    private readonly playlistService

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

    public async deletePlaylist(request: Request<{ id: string }, {}>, response: Response) {
        return await this.playlistService.deletePlaylist(request, response)
    }

    public async addSongs(request: Request<{ id: string }, {}, PlaylistSongDto>, response: Response) {
        return await this.playlistService.addSongs(request, response)
    }

    public async removeSongs(request: Request<{ id: string }, {}, PlaylistSongDto>, response: Response) {
        return await this.playlistService.removeSongs(request, response)
    }
}

export default new PlaylistController()