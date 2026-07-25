import http from 'node:http'
import express, { Request, Response } from 'express'
import cookieParser from "cookie-parser"
import { env } from '@yukikaze/lib/create-env'
import { errorInterceptor, notFoundHandlerMiddleware, responseInterceptor } from '@yukikaze/middleware'
import { notificationRouter } from './modules'
import { createSocketServer } from './socket'

const port = env.NOTIFICATION_SERVICE_PORT
const app = express()

app.set('trust proxy', 1)

app.use(responseInterceptor)
app.use(cookieParser())
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(express.json({ limit: '1mb' }))

app.get('/check', (_: Request, response: Response) => {
    response.json({ message: 'Welcome to YukikazeMP3 Notification Service!' })
})

app.use('/', [notificationRouter])
app.use([notFoundHandlerMiddleware, errorInterceptor])

const server = http.createServer(app)

createSocketServer(server)

server.listen(port, () => {
    console.log(`The notification service is running at http://localhost:${port}`)
})
