import 'reflect-metadata'
import express, { Request, response, Response } from 'express'
import env from './lib/helpers/env'
import { errorHandlerMiddleware, notFoundHandlerMiddleware } from './middleware'
// import { realtimeChat } from './modules/socket/realtime.chat'
import { artistRouter, playlistRouter, songRouter, userRouter } from './modules'
import { testRouter } from './modules/test'

const app = express()
// for parsing content-type of application/json & application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const port = env.PORT || 3000

app.get('/', (_: Request, res: Response) => {
    res.json({ message: 'Welcome to the Express + TypeScript Server!' })
})

// realtimeChat(app)

// map routers to express server
app.use('/api/v1', [userRouter, playlistRouter, songRouter, artistRouter])

app.use('/', testRouter)

// assign global middlewares to express server
app.use([notFoundHandlerMiddleware, errorHandlerMiddleware])

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})