import { Request, Response } from "express"
import { UserService } from "./user.service"
import { UpdateUserDto } from "./dto/update-user.dto"

class UserController {
    private readonly userService: UserService

    constructor() {
        this.userService = new UserService()
    }

    public async getUsers(request: Request, response: Response) {
        return await this.userService.getUsers(request, response)
    }

    public async findUser(request: Request<{ id: string }>, response: Response) {
        return await this.userService.findUser(request, response)
    }

    public async myProfile(request: Request, response: Response) {
        return await this.userService.myProfile(request, response)
    }

    public async updateUser(request: Request<{ id: string }, {}, UpdateUserDto>, response: Response) {
        return await this.userService.updateUser(request, response)
    }

    public async verifyEmail(request: Request<{ id: string }, {}, {}, { token: string }>, response: Response) {
        return await this.userService.verifyEmail(request, response)
    }

    public async userSongs(request: Request<{}, {}, {}, { type: 'upload' | 'favorite' }>, response: Response) {
        return await this.userService.userSongs(request, response)
    }

    public async userPlaylists(request: Request<{}, {}, {}, { type: 'upload' | 'favorite' }>, response: Response) {
        return await this.userService.userPlaylists(request, response)
    }

    public async userArtists(request: Request, response: Response) {
        return await this.userService.userArtists(request, response)
    }

    public async toggleFavoriteSong(request: Request<{ id: string }>, response: Response) {
        return await this.userService.toggleFavoriteSong(request, response)
    }

    public async toggleFavoritePlaylist(request: Request<{ id: string }>, response: Response) {
        return await this.userService.toggleFavoritePlaylist(request, response)
    }

    public async toggleFollowArtist(request: Request<{ id: string }>, response: Response) {
        return await this.userService.toggleFollowArtist(request, response)
    }
}

export default new UserController()