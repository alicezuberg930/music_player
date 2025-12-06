"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitemapController = void 0;
const sitemap_service_1 = require("./sitemap.service");
const exceptions_1 = require("../../lib/exceptions");
class SitemapController {
    constructor() {
        this.sitemapService = new sitemap_service_1.SitemapService();
    }
    async generateSitemap(_, response) {
        try {
            const sitemap = await this.sitemapService.generateSitemap();
            // response.header('Content-Type', 'application/xml')
            response.header('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
            // response.send(sitemap)
            return response.json(sitemap);
        }
        catch (error) {
            console.error('Error generating sitemap:', error);
            throw new exceptions_1.BadRequestException('Error generating sitemap');
        }
    }
}
exports.SitemapController = SitemapController;
