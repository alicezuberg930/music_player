import express, { Request, Response } from 'express'
import cookieParser from "cookie-parser"
import { env } from '@yukikaze/lib/create-env'
import { errorInterceptor, notFoundHandlerMiddleware, responseInterceptor } from '@yukikaze/middleware'
import { localAuthRoute } from './modules'
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

const port = env.AUTH_SERVICE_PORT

app.get('/check', (_: Request, res: Response) => {
    res.json({ message: 'Welcome to YukikazeMP3 Express Server!' })
})

// map routers to express server
app.use('/', [localAuthRoute])

// assign global middlewares to express server
app.use([notFoundHandlerMiddleware, errorInterceptor])

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})