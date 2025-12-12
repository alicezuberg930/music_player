import 'dotenv/config'
import express from 'express'
import compression from 'compression'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.WEB_PORT

// Enable gzip compression for all responses
app.use(compression({
    level: 6,
    threshold: 1024, // Only compress files bigger than 1KB
    filter: (req, res) => {
        if (req.headers['x-no-compression']) return false
        return compression.filter(req, res)
    }
}))

// Serve static files from client build
app.use(express.static(path.join(__dirname, 'dist')))

app.get('/*splat', async (req, res) => {
    try {
        const indexPath = path.join(__dirname, 'dist', 'index.html')
        let html = fs.readFileSync(indexPath, 'utf8')
        const currentBaseUrl = `${req.protocol}://${req.get('host')}`
        const currentUrl = `${currentBaseUrl}${req.originalUrl}`

        let meta = {}
        // Static routes
        const staticMeta = {
            '/home': {
                title: 'Yukikaze Music Player',
                description: 'Listen to your favorite music online. Stream songs, create playlists, and discover new artists on Yukikaze Music Player.',
                image: `${currentBaseUrl}/web-app-manifest-512x512.png`,
            },
            '/sign-in': {
                title: 'Đăng nhập',
                description: 'Đăng nhập tài khoản để trải nghiệm thêm tính năng của Yukikaze Music Player.',
                image: `${currentBaseUrl}/web-app-manifest-512x512.png`,
            },
            '/sign-up': {
                title: 'Đăng ký',
                description: 'Tạo tài khoản mới để upload nhạc và tạo playlist của riêng bạn.',
                image: `${currentBaseUrl}/web-app-manifest-512x512.png`,
            },
        }

        if (staticMeta[req.path]) {
            meta = staticMeta[req.path]
        }

        const playlistMatch = req.path.match(/^\/playlist\/([\w-]+)$/)
        if (playlistMatch) {
            try {
                const response = await fetch(`${process.env.API_URL}/playlists/${playlistMatch[1]}`)
                const data = await response.json()
                if (data && data.data) {
                    meta = {
                        title: `Playlist - ${data.data.title ?? 'Yukikaze Music Player'}`,
                        description: data.data.description ?? 'Nghe danh sách phát của bạn trên Yukikaze Music Player',
                        image: data.data.thumbnail ?? `${currentBaseUrl}/web-app-manifest-512x512.png`,
                    }
                }
            } catch (error) {
                console.error('Error fetching playlist:', error)
            }
        }

        const artistMatch = req.path.match(/^\/artist\/([\w-]+)$/)
        if (artistMatch) {
            try {
                const response = await fetch(`${process.env.API_URL}/artists/${artistMatch[1]}`)
                const data = await response.json()
                if (data && data.data) {
                    meta = {
                        title: `Artist - ${data.data.name ?? 'Yukikaze Music Player'}`,
                        description: data.data.description ?? `${data.data.name} - Thông tin nhạc sĩ`,
                        image: data.data.thumbnail ?? `${currentBaseUrl}/web-app-manifest-512x512.png`,
                    }
                }
            } catch (error) {
                console.error('Error fetching artist:', error)
            }
        }

        if (meta) {
            // HTML-escape inserted values
            const esc = (v) => String(v ?? '').replace(/[&<>\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
            html = html.replace(/<title>.*?<\/title>/i, `<title>${esc(meta.title)}</title>`)
            html = html.replace(/<meta[^>]*name=["']description["'][^>]*>/i, `<meta name="description" content="${esc(meta.description)}" />`)
            // Open Graph tags (match by property attribute, robust to whitespace/attribute order)
            html = html.replace(/<meta[^>]*property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${esc(meta.title)}" />`)

            html = html.replace(/<meta[^>]*property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${esc(meta.description)}" />`)

            html = html.replace(/<meta[^>]*property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${esc(meta.image)}" />`)

            html = html.replace(/<meta[^>]*property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${esc(currentUrl)}" />`)
            // Twitter Card tags (match by name attribute)
            html = html.replace(/<meta[^>]*name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${esc(meta.title)}" />`)

            html = html.replace(/<meta[^>]*name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${esc(meta.description)}" />`)

            html = html.replace(/<meta[^>]*name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${esc(meta.image)}" />`)

            html = html.replace(/<meta[^>]*name=["']twitter:url["'][^>]*>/i, `<meta name="twitter:url" content="${esc(currentUrl)}" />`)
        }
        res.send(html)
    } catch (error) {
        console.error('Server error:', error)
        res.status(500).send('Internal server error')
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})