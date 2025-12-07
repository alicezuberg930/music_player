import { Request, Response } from "express"
import { SitemapService } from "./sitemap.service"
import { BadRequestException } from "../../lib/exceptions"

export class SitemapController {
    private readonly sitemapService: SitemapService

    constructor() {
        this.sitemapService = new SitemapService()
    }

    public async generateSitemapXML(_: Request, response: Response) {
        try {
            const sitemap = await this.sitemapService.generateSitemapXML()
            response.header('Content-Type', 'application/xml')
            response.header('Cache-Control', 'public, max-age=86400')
            response.send(sitemap)
        } catch (error) {
            console.error('Error generating sitemap:', error)
            throw new BadRequestException('Error generating sitemap')
        }
    }
}
