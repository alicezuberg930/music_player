import { BannerService } from "./banner.service";
class BannerController {
    bannerService;
    constructor() {
        this.bannerService = new BannerService();
    }
    async getBanners(request, response) {
        return await this.bannerService.getBanners(request, response);
    }
    async createBanner(request, response) {
        return await this.bannerService.createBanner(request, response);
    }
    async updateBanner(request, response) {
        return await this.bannerService.updateBanner(request, response);
    }
    async findBanner(request, response) {
        return await this.bannerService.findBanner(request, response);
    }
    async deleteBanner(request, response) {
        return await this.bannerService.deleteBanner(request, response);
    }
}
export default new BannerController();
