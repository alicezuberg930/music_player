import { SitemapService } from "./sitemap.service";
import { BadRequestException } from "@yukikaze/lib/exception";
export class SitemapController {
    sitemapService;
    constructor() {
        this.sitemapService = new SitemapService();
    }
    async generateSitemapXML(_, response) {
        try {
            const sitemap = await this.sitemapService.generateSitemapXML();
            response.header('Content-Type', 'application/xml');
            response.header('Cache-Control', 'public, max-age=86400');
            response.send(sitemap);
        }
        catch (error) {
            console.error('Error generating sitemap:', error);
            throw new BadRequestException('Error generating sitemap');
        }
    }
    async generateSitemapURLS(_, response) {
        try {
            const data = await this.sitemapService.generateSitemapURLs();
            response.header('Cache-Control', 'public, max-age=86400');
            response.json({ data });
        }
        catch (error) {
            console.error('Error generating sitemap URLs:', error);
            throw new BadRequestException('Error generating sitemap URLs');
        }
    }
}
