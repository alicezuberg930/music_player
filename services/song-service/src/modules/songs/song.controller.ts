import { Request, Response } from "express"
import { SongService } from "./song.service"
import { CreateSongDto } from "./dto/create-song.dto"
import { UpdateSongDto } from "./dto/update-song.dto"
import { QueryParams } from "./dto/query.param"

class SongController {
    private readonly songService: SongService

    constructor() {
        this.songService = new SongService()
    }

    public async getSongs(request: Request<{}, {}, {}, QueryParams>, response: Response) {
        return await this.songService.getSongs(request, response)
    }

    public async createSong(request: Request<{}, {}, CreateSongDto>, response: Response) {
        return await this.songService.createSong(request, response)
    }

    public async updateSong(request: Request<{ id: string }, {}, UpdateSongDto>, response: Response) {
        return await this.songService.updateSong(request, response)
    }

    public async findSong(request: Request<{ id: string }>, response: Response) {
        return await this.songService.findSong(request, response)
    }

    public async deleteSong(request: Request<{ id: string }, {}>, response: Response) {
        return await this.songService.deleteSong(request, response)
    }

    public async addSongListen(request: Request<{ id: string }, {}>, response: Response) {
        return await this.songService.addSongListen(request, response)
    }
}

export default new SongController()