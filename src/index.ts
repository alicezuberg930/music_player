import 'reflect-metadata'
import express, { Request, Response } from 'express'
import env from './lib/helpers/env'
import userRouter from './modules/users/user.route'
import songRouter from './modules/songs/song.route'
import playlistRouter from './modules/playlists/playlist.route'
import { errorHandlerMiddleware, notFoundHandlerMiddleware } from './middleware'
import { realtimeChat } from './modules/socket/realtime.chat'

const app = express()
// For parsing content-type of application/json & application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const port = env.PORT || 3000

app.get('/', (_: Request, res: Response) => {
    res.json({ message: 'Welcome to the Express + TypeScript Server!' })
})

realtimeChat(app)

// routers
app.use('/api/v1', [userRouter, playlistRouter, songRouter])

// middlewares
app.use([notFoundHandlerMiddleware, errorHandlerMiddleware])

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})