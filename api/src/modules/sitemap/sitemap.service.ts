import { db, eq } from "../../db"
import { artists, playlists } from "../../db/schemas"

export class SitemapService {
    private readonly baseUrl = 'https://tien-music-player.site'

    public async generateSitemapXML(): Promise<string> {
        const urls: string[] = []
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
        ]
        for (const route of staticRoutes)
            urls.push(this.createUrlEntryXML(route.path, route.priority, route.changefreq))

        // Add dynamic playlist routes
        const playlistsList = await db.select({
            id: playlists.id, updatedAt: playlists.updatedAt
        }).from(playlists).where(eq(playlists.isPrivate, false))

        for (const playlist of playlistsList)
            urls.push(this.createUrlEntryXML(`/playlist/${playlist.id}`, '0.8', 'daily', playlist.updatedAt))

        // Add dynamic artist routes
        const artistsList = await db.select({
            id: artists.id, updatedAt: artists.updatedAt
        }).from(artists)

        for (const artist of artistsList)
            urls.push(this.createUrlEntryXML(`/artist/${artist.id}`, '0.8', 'daily', artist.updatedAt))

        return this.wrapInSitemapXML(urls)
    }

    private createUrlEntryXML(path: string, priority: string, changefreq: string, lastmod?: Date | string): string {
        const lastModDate = lastmod ? new Date(lastmod).toISOString() : new Date().toISOString()
        return `
            <url>
                <loc>${this.baseUrl}${path}</loc>
                <lastmod>${lastModDate}</lastmod>
                <changefreq>${changefreq}</changefreq>
                <priority>${priority}</priority>
            </url>
        `
    }

    private wrapInSitemapXML(urls: string[]): string {
        return `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
                ${urls.join('\n')}
            </urlset>
        `
    }
}