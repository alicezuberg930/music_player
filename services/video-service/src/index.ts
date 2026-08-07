import express, { Request, Response } from 'express'
import path from 'node:path'
import cookieParser from "cookie-parser"
import { env } from '@yukikaze/lib/create-env'
import { errorInterceptor, notFoundHandlerMiddleware, responseInterceptor } from '@yukikaze/middleware'
import { videoRouter } from './modules'
const app = express()
const serviceRoot = path.resolve(__dirname, '..')

app.set('trust proxy', 1);

// Add response interceptor early
app.use(responseInterceptor)

// parse cookies
app.use(cookieParser())

// expose generated adaptive-stream assets from the service tmp folder
app.use('/tmp', express.static(path.join(serviceRoot, 'tmp')))

// for parsing content-type of application/json & application/x-www-form-urlencoded
// Increase body size limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '21mb' }))
app.use(express.json({ limit: '21mb' }))

const port = env.VIDEO_SERVICE_PORT

app.get('/check', (_: Request, res: Response) => {
    res.json({ message: 'Welcome to YukikazeMP3 Express Server!' })
})

// map routers to express server
app.use('/', [videoRouter])

// assign global middlewares to express server
app.use([notFoundHandlerMiddleware, errorInterceptor])

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})