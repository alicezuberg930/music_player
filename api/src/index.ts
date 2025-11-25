import 'reflect-metadata'
import express, { Request, Response } from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import env from './lib/helpers/env'
import { errorHandlerMiddleware, notFoundHandlerMiddleware, responseInterceptor } from './middleware'
import { artistRouter, playlistRouter, songRouter, userRouter } from './modules'

const app = express()

// Add response interceptor early
app.use(responseInterceptor)

// setup cors
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173', 'https://aismartlite.cloud', 'https://api.aismartlite.cloud'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))

// parse cookies
app.use(cookieParser())

// for parsing content-type of application/json & application/x-www-form-urlencoded
// Increase body size limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '21mb' }))
app.use(express.json({ limit: '21mb' }))

const port = env.PORT || 3000

app.get('/', (_: Request, res: Response) => {
    res.json({ message: 'Welcome to the Express + TypeScript Server!' })
})

// map routers to express server
app.use('/api/v1', [userRouter, playlistRouter, songRouter, artistRouter])

// assign global middlewares to express server
app.use([notFoundHandlerMiddleware, errorHandlerMiddleware])

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})