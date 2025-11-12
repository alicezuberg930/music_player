import { Request, Response } from "express"
import { UserService } from "./user.service"
import { CreateUserDto } from "./dto/create-user.dto"
import { LoginUserDto } from "./dto/login-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"

class UserController {
    private userService

    constructor() {
        this.userService = new UserService()
    }

    public async getUsers(request: Request, response: Response) {
        return await this.userService.getUsers(request, response)
    }

    public async registerUser(request: Request<{}, {}, CreateUserDto>, response: Response) {
        try {
            const data = await this.userService.createUser(request)
            return response.status(201).json({ data, message: 'User created successfully' })
        } catch (error) {
            return response.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error' })
        }
    }

    public async loginUser(request: Request<{}, {}, LoginUserDto>, response: Response) {
        try {
            const data = await this.userService.createUser(request)
            return response.status(201).json({ data, message: 'User created successfully' })
        } catch (error) {
            return response.status(500).json({ message: error instanceof Error ? error.message : 'Internal Server Error' })
        }
    }

    public async findUser(request: Request<{ id: string }>, response: Response) {
        return await this.userService.findUser(request, response)
    }

    public async findMyProfile(request: Request, response: Response) {
        return await this.userService.findMyProfile(request, response)
    }

    public async updateUser(request: Request<{ id: string }, {}, UpdateUserDto>, response: Response) { }
}

export default new UserController()