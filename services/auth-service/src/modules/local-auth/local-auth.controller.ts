import { Request, Response } from "express"
import { UserService } from "./local-auth.service"
import { AuthValidators } from "@yukikaze/validator"

class UserController {
    private readonly userService: UserService

    constructor() {
        this.userService = new UserService()
    }

    public async signUp(request: Request<{}, {}, AuthValidators.RegisterInput>, response: Response) {
        return await this.userService.signUp(request, response)
    }

    public async signIn(request: Request<{}, {}, AuthValidators.LoginInput>, response: Response) {
        return await this.userService.signIn(request, response)
    }

    public async signOut(request: Request, response: Response) {
        return await this.userService.signOut(request, response)
    }

    public async refreshToken(request: Request, response: Response) {
        return await this.userService.refreshToken(request, response)
    }
}

export default new UserController()