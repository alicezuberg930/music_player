import { Request, Response } from "express"
import { SongService } from "./song.service"
import { CreateSongDto } from "./dto/create-song.dto"

class SongController {
    private songService

    constructor() {
        this.songService = new SongService()
    }

    public async getSongs(request: Request, response: Response) {
        return await this.songService.getSongs(request, response)
    }

    public async createSong(request: Request<{}, {}, CreateSongDto>, response: Response) {
        return await this.songService.createSong(request, response)
    }

    public async findSong(request: Request, response: Response) {
        return await this.songService.findSong(request, response)
    }
}

export default new SongController()