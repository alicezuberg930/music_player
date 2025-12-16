import { Request, Response } from "express"
import { HomeService } from "./home.service"

class HomeController {
    private readonly homeService: HomeService

    constructor() {
        this.homeService = new HomeService()
    }

    public async getHome(request: Request, response: Response) {
        return await this.homeService.getHome(request, response)
    }
}

export default new HomeController()