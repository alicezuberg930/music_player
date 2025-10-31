import { Request, Response } from "express"
import { SongService } from "./song.service"

class UserController {
    private songService

    constructor() {
        this.songService = new SongService()
    }

    public async getUsers(request: Request, response: Response) {
        try {
            const data = await this.songService.getSongs(request)
            return response.json({ data, message: 'Song list fetched successfully' })
        } catch (error) {
            return response.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error' })
        }
    }

    public async createUser(request: Request, response: Response) {
        try {
            const data = await this.songService.createSong(request)
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

export default new UserController()