import express from 'express'
// import cors from "cors"
// import cookieParser from "cookie-parser"
import { env } from '@yukikaze/lib/create-env'
import { homeRouter } from './modules/home/home.route';
// import { errorInterceptor, notFoundHandlerMiddleware, responseInterceptor } from './middleware'
const app = express()

app.set('trust proxy', 1);

// Add response interceptor early
// app.use(responseInterceptor)

// setup cors
// app.use(cors({
//     origin: ['http://localhost:5173', 'https://tien-music-player.site', 'https://www.tien-music-player.site'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
// }))

// parse cookies
// app.use(cookieParser())

// for parsing content-type of application/json & application/x-www-form-urlencoded
// Increase body size limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '21mb' }))
app.use(express.json({ limit: '21mb' }))

const port = env.HOME_SERVICE_PORT || 5001

// app.get('/', (_: Request, res: Response) => {
//     res.json({ message: 'Welcome to Tiếns MP3 Express Server!' })
// })

app.use('/', homeRouter)

// assign global middlewares to express server
// app.use([notFoundHandlerMiddleware, errorInterceptor])

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`)
})