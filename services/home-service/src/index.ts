import express, { Request, Response } from 'express'
import cookieParser from "cookie-parser"
import { env } from '@yukikaze/lib/create-env'
import { homeRouter, sitemapRouter } from './modules';
import { errorInterceptor, notFoundHandlerMiddleware, responseInterceptor } from '@yukikaze/middleware'
const app = express()

app.set('trust proxy', 1);

// Add response interceptor early
app.use(responseInterceptor)

// parse cookies
app.use(cookieParser())

// for parsing content-type of application/json & application/x-www-form-urlencoded
// Increase body size limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '21mb' }))
app.use(express.json({ limit: '21mb' }))

const port = env.HOME_SERVICE_PORT

app.get('/check', (_: Request, res: Response) => {
    res.json({ message: 'Welcome to YukikazeMP3 Express Server!' })
})

// map routers to express server
app.use('/', [homeRouter, sitemapRouter])

// assign global middlewares to express server
app.use([notFoundHandlerMiddleware, errorInterceptor])

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})