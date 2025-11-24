import 'dotenv/config'
import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
const routeMeta = {
    '/signin': {
        title: 'Đăng nhập',
        description: 'Đăng nhập tài khoản để trải nghiệm thêm tính năng của MP3 Music Player.',
        image: 'https://aismartlite.cloud/music-og.png',
    },
    '/signup': {
        title: 'Đăng ký',
        description: 'Tạo tài khoản mới để upload nhạc và tạo playlist của riêng bạn.',
        image: 'https://aismartlite.cloud/music-og.png',
    },
}

app.get('/*splat', (req, res) => {
    const userAgent = req.headers['user-agent'] || ''
    const isBot = botUserAgents.some(bot => userAgent.toLowerCase().includes(bot.toLowerCase()))
    
    if (isBot) {
        const indexPath = path.join(__dirname, 'dist', 'index.html')
        let html = fs.readFileSync(indexPath, 'utf8')

        const meta = routeMeta[req.path] || routeMeta['/']

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
                `<meta property="og:url" content="https://aismartlite.cloud${req.path}"/>`
            )
        }
        res.send(html)
    } else {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})