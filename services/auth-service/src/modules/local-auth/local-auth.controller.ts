import { Request, Response } from "express"
import { UserService } from "./local-auth.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { LoginUserDto } from "./dto/login-user.dto"

class UserController {
    private readonly userService: UserService

    constructor() {
        this.userService = new UserService()
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
}

export default new UserController()