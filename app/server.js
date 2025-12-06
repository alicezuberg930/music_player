import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')))

// Bot user agents that need meta tags
const botUserAgents = [
    'facebookexternalhit',
    'Twitterbot',
    'LinkedInBot',
    'WhatsApp',
    'Slackbot',
    'Discordbot',
    'telegrambot',
]

// Meta tags for different routes
let routeMeta = {
    '/sign-in': {
        title: 'Đăng nhập',
        description: 'Đăng nhập tài khoản để trải nghiệm thêm tính năng của Yukikaze Music Player.',
        image: 'https://tien-music-player.site/web-app-manifest-512x512.png',
    },
    '/sign-up': {
        title: 'Đăng ký',
        description: 'Tạo tài khoản mới để upload nhạc và tạo playlist của riêng bạn.',
        image: 'https://tien-music-player.site/web-app-manifest-512x512.png',
    },
}

app.get('/*splat', async (req, res) => {
    // const userAgent = req.headers['user-agent'] || ''

    const playlistMatch = req.path.match(/^\/playlist\/([\w-]+)$/)
    if (playlistMatch) {
        const response = await fetch(`${process.env.VITE_API_URL}/playlists/${playlistMatch[1]}`)
        const data = await response.json()
        if (data && data.data) {
            routeMeta[req.path] = {
                title: data.data.title,
                description: data.data.description || 'Nghe playlist của bạn trên Yukikaze Music Player.',
                image: data.data.thumbnail || 'https://tien-music-player.site/web-app-manifest-512x512.png',
            }
        } else {
            routeMeta[req.path] = {
                title: 'Playlist không tồn tại',
                description: 'Playlist bạn đang tìm kiếm không tồn tại.',
                image: 'https://tien-music-player.site/web-app-manifest-512x512.png',
            }
        }
    }


    const artistMatch = req.path.match(/^\/artist\/([\w-]+)$/)
    if (artistMatch) {
        const response = await fetch(`${process.env.VITE_API_URL}/artists/${artistMatch[1]}`)
        const data = await response.json()
        if (data && data.data) {
            routeMeta[req.path] = {
                title: data.data.title,
                description: data.data.description || `${data.data.title} - Yukikaze Music Player.`,
                image: data.data.thumbnail || 'https://tien-music-player.site/web-app-manifest-512x512.png',
            }
        } else {
            routeMeta[req.path] = {
                title: 'Nhạc sĩ không tồn tại',
                description: 'Nhạc sĩ bạn đang tìm kiếm không tồn tại.',
                image: 'https://tien-music-player.site/web-app-manifest-512x512.png',
            }
        }
    }

    const indexPath = path.join(__dirname, 'dist', 'index.html')
    let html = fs.readFileSync(indexPath, 'utf8')
    const meta = routeMeta[req.path]

    if (meta) {
        html = html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`)
        html = html.replace(
            /<meta name="description" content=".*?"\/>/,
            `<meta name="description" content="${meta.description}"/>`
        )
        html = html.replace(
            /<meta property="og:title" content=".*?"\/>/,
            `<meta property="og:title" content="${meta.title}"/>`
        )
        html = html.replace(
            /<meta property="og:description" content=".*?"\/>/,
            `<meta property="og:description" content="${meta.description}"/>`
        )
        html = html.replace(
            /<meta property="og:image" content=".*?"\/>/,
            `<meta property="og:image" content="${meta.image}"/>`
        )
        html = html.replace(
            /<meta property="og:url" content=".*?"\/>/,
            `<meta property="og:url" content="https://tien-music-player.site${req.path}"/>`
        )
    }
    res.send(html)
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})