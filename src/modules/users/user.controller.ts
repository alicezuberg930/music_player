import { Request, Response } from "express"
import { UserService } from "./user.service"

class UserController {
    private userService

    constructor() {
        this.userService = new UserService()
    }

    public async getUsers(request: Request, response: Response) {
        try {
            const data = await this.userService.getUsers(request)
            return response.json({ data, message: 'Users list fetched successfully' })
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