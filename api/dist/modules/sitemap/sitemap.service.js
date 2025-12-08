"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SitemapService = void 0;
const db_1 = require("../../db");
const schemas_1 = require("../../db/schemas");
class SitemapService {
    constructor() {
        this.baseUrl = 'https://tien-music-player.site';
    }
    async generateSitemapURLs() {
        const urls = [
            '/',
            '/search',
            '/search/all',
            '/search/songs',
            '/search/playlists',
            '/search/artists',
            '/search/mv',
            '/chart',
            '/chart/week',
        ];
        // Add dynamic playlist routes
        const playlistsList = await db_1.db.select({
            id: schemas_1.playlists.id, updatedAt: schemas_1.playlists.updatedAt
        }).from(schemas_1.playlists).where((0, db_1.eq)(schemas_1.playlists.isPrivate, false));
        for (const playlist of playlistsList)
            urls.push(`/playlist/${playlist.id}`);
        // Add dynamic artist routes
        const artistsList = await db_1.db.select({
            id: schemas_1.artists.id, updatedAt: schemas_1.artists.updatedAt
        }).from(schemas_1.artists);
        for (const artist of artistsList)
            urls.push(`/artist/${artist.id}`);
        return urls;
    }
    async generateSitemapXML() {
        const urls = [];
        const staticRoutes = [
            { path: '/', priority: '1.0', changefreq: 'daily' },
            { path: '/search', priority: '0.9', changefreq: 'daily' },
            { path: '/search/all', priority: '0.9', changefreq: 'daily' },
            { path: '/search/songs', priority: '0.9', changefreq: 'daily' },
            { path: '/search/playlists', priority: '0.9', changefreq: 'daily' },
            { path: '/search/artists', priority: '0.9', changefreq: 'daily' },
            { path: '/search/mv', priority: '0.9', changefreq: 'daily' },
            { path: '/chart', priority: '0.9', changefreq: 'daily' },
            { path: '/chart/week', priority: '0.9', changefreq: 'weekly' },
        ];
        for (const route of staticRoutes)
            urls.push(this.createUrlEntryXML(route.path, route.priority, route.changefreq));
        // Add dynamic playlist routes
        const playlistsList = await db_1.db.select({
            id: schemas_1.playlists.id, updatedAt: schemas_1.playlists.updatedAt
        }).from(schemas_1.playlists).where((0, db_1.eq)(schemas_1.playlists.isPrivate, false));
        for (const playlist of playlistsList)
            urls.push(this.createUrlEntryXML(`/playlist/${playlist.id}`, '0.8', 'daily', playlist.updatedAt));
        // Add dynamic artist routes
        const artistsList = await db_1.db.select({
            id: schemas_1.artists.id, updatedAt: schemas_1.artists.updatedAt
        }).from(schemas_1.artists);
        for (const artist of artistsList)
            urls.push(this.createUrlEntryXML(`/artist/${artist.id}`, '0.8', 'daily', artist.updatedAt));
        return this.wrapInSitemapXML(urls);
    }
    createUrlEntryXML(path, priority, changefreq, lastmod) {
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
    wrapInSitemapXML(urls) {
        return `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
                ${urls.join('\n')}
            </urlset>
        `;
    }
}
exports.SitemapService = SitemapService;
