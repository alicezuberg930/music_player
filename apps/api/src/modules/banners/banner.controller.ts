import { Request, Response } from "express"
import { BannerService } from "./banner.service"
import { CreateBannerDto } from "./dto/create-banner.dto"
import { UpdateBannerDto } from "./dto/update-banner.dto"

class BannerController {
    private readonly bannerService: BannerService

    constructor() {
        this.bannerService = new BannerService()
    }

    public async getBanners(request: Request, response: Response) {
        return await this.bannerService.getBanners(request, response)
    }

    public async createBanner(request: Request<{}, {}, CreateBannerDto>, response: Response) {
        return await this.bannerService.createBanner(request, response)
    }

    public async updateBanner(request: Request<{ id: string }, {}, UpdateBannerDto>, response: Response) {
        return await this.bannerService.updateBanner(request, response)
    }

    public async findBanner(request: Request<{ id: string }>, response: Response) {
        return await this.bannerService.findBanner(request, response)
    }

    public async deleteBanner(request: Request<{ id: string }>, response: Response) {
        return await this.bannerService.deleteBanner(request, response)
    }
}

export default new BannerController()
