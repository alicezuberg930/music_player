import { Router } from "express";
import { SitemapController } from "./sitemap.controller";
const sitemapRouter = Router();
const sitemapController = new SitemapController();
sitemapRouter.get('/sitemap.xml', (request, response) => sitemapController.generateSitemapXML(request, response));
sitemapRouter.get('/sitemap-urls', (request, response) => sitemapController.generateSitemapURLS(request, response));
export { sitemapRouter };
