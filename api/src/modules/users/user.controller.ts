import { Request, Response } from "express"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { LoginUserDto } from "./dto/login-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"

class UserController {
    private readonly userService

    constructor() {
        this.userService = new UserService()
    }

    public async getUsers(request: Request, response: Response) {
        return await this.userService.getUsers(request, response)
    }

    public async signUp(request: Request<{}, {}, CreateUserDto>, response: Response) {
        return await this.userService.signUp(request, response)
    }

    public async signIn(request: Request<{}, {}, LoginUserDto>, response: Response) {
        return await this.userService.signIn(request, response)
    }

    public async signOut(request: Request, response: Response) {
        return await this.userService.signOut(request, response)
    }

    public async findUser(request: Request<{ id: string }>, response: Response) {
        return await this.userService.findUser(request, response)
    }

    public async myProfile(request: Request, response: Response) {
        return await this.userService.myProfile(request, response)
    }

    public async updateUser(request: Request<{ id: string }, {}, UpdateUserDto>, response: Response) { }
}

export default new UserController()