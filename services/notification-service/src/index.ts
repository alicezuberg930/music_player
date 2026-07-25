import http from 'node:http'
import { env } from '@yukikaze/lib/create-env'
import { createSocketServer } from './socket'

const port = env.NOTIFICATION_SERVICE_PORT

const server = http.createServer((request, response) => {
    if (request.method === 'GET' && request.url === '/check') {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(
            JSON.stringify({ message: 'Welcome to YukikazeMP3 Notification Service!' }),
        )
        return
    }
    response.writeHead(404, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ message: 'Not found' }))
})

createSocketServer(server)

server.listen(port, () => {
    console.log(`The notification service is running at http://localhost:${port}`)
})