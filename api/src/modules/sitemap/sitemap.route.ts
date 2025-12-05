import { Router } from "express"
import { SitemapController } from "./sitemap.controller"

const sitemapRouter = Router()
const sitemapController = new SitemapController()

sitemapRouter.get('/sitemap.xml', (req, res) => sitemapController.generateSitemap(req, res))

export { sitemapRouter }