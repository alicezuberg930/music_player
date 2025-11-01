import { Request, Response } from "express"
import { PlaylistService } from "./playlist.service"

class PlaylistController {
    private playlistService

    constructor() {
        this.playlistService = new PlaylistService()
    }

    public async getPlaylists(request: Request, response: Response) {
        try {
            const data = await this.playlistService.getPlaylists(request)
            return response.json({ data, message: 'Song list fetched successfully' })
        } catch (error) {
            return response.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error' })
        }
    }

    public async createPlaylist(request: Request, response: Response) {
        try {
            const data = await this.playlistService.createPlaylist(request)
            return response.status(201).json({ data, message: 'Song created successfully' })
        } catch (error) {
            return response.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error' })
        }
    }

    public async findUser(request: Request, response: Response) {
        try {
            const { id } = request.params
        } catch (error) {

        }
    }
}

export default new PlaylistController()