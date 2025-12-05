"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitemapService = void 0;
const env_1 = __importDefault(require("../../lib/helpers/env"));
const db_1 = require("../../db");
const schemas_1 = require("../../db/schemas");
class SitemapService {
    constructor() {
        this.baseUrl = env_1.default.WEB_URL || 'https://tien-music-player.site';
    }
    async generateSitemap() {
        const urls = [];
        // Add static routes
        const staticRoutes = [
            { path: '/', priority: '1.0', changefreq: 'daily' },
            { path: '/search', priority: '0.8', changefreq: 'daily' },
            { path: '/search/all', priority: '0.8', changefreq: 'daily' },
            { path: '/search/songs', priority: '0.8', changefreq: 'daily' },
            { path: '/search/playlists', priority: '0.8', changefreq: 'daily' },
            { path: '/search/artists', priority: '0.8', changefreq: 'daily' },
            { path: '/search/mv', priority: '0.8', changefreq: 'daily' },
            { path: '/chart', priority: '0.8', changefreq: 'daily' },
            { path: '/chart/week', priority: '0.8', changefreq: 'weekly' },
        ];
        // add static routes
        for (const route of staticRoutes)
            urls.push(this.createUrlEntry(route.path, route.priority, route.changefreq));
        // Add dynamic playlist routes
        const playlistsList = await db_1.db.select({
            id: schemas_1.playlists.id, updatedAt: schemas_1.playlists.updatedAt
        }).from(schemas_1.playlists).where((0, db_1.eq)(schemas_1.playlists.isPrivate, false));
        for (const playlist of playlistsList)
            urls.push(this.createUrlEntry(`/playlist/${playlist.id}`, '0.7', 'daily', playlist.updatedAt));
        // Add dynamic artist routes
        const artistsList = await db_1.db.select({
            id: schemas_1.artists.id, updatedAt: schemas_1.artists.updatedAt
        }).from(schemas_1.artists);
        for (const artist of artistsList)
            urls.push(this.createUrlEntry(`/artist/${artist.id}`, '0.7', 'daily', artist.updatedAt));
        return this.wrapInSitemapXml(urls);
    }
    createUrlEntry(path, priority, changefreq, lastmod) {
        const lastModDate = lastmod ? new Date(lastmod).toISOString() : new Date().toISOString();
        return `
            <url>
                <loc>${this.baseUrl}${path}</loc>
                <lastmod>${lastModDate}</lastmod>
                <changefreq>${changefreq}</changefreq>
                <priority>${priority}</priority>
            </url>
        `;
    }
    wrapInSitemapXml(urls) {
        return `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                ${urls.join('\n')}
            </urlset>
        `;
    }
}
exports.SitemapService = SitemapService;
