import 'reflect-metadata'
import express, { Request, Response } from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import env from './lib/helpers/env'
import { errorHandlerMiddleware, notFoundHandlerMiddleware } from './middleware'
import { artistRouter, playlistRouter, songRouter, userRouter } from './modules'

const app = express()

// setup cors
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173', 'https://aismartlite.cloud', 'https://api.aismartlite.cloud'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    // allowedHeaders: ['Content-Type', 'Authorization'],
}))

// parse cookies
app.use(cookieParser())

// for parsing content-type of application/json & application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

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