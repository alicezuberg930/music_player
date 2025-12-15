"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const banner_service_1 = require("./banner.service");
class BannerController {
    constructor() {
        this.bannerService = new banner_service_1.BannerService();
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
exports.default = new BannerController();
