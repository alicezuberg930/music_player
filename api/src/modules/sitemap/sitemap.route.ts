import { Router, Request, Response } from "express"
import { SitemapController } from "./sitemap.controller"

const sitemapRouter = Router()
const sitemapController = new SitemapController()

sitemapRouter.get('/sitemap.xml', (request: Request, response: Response) => sitemapController.generateSitemapXML(request, response))

export { sitemapRouter }