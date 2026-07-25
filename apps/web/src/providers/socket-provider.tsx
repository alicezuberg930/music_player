import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { io, type Socket } from 'socket.io-client'

interface ServerToClientEvents {
    'notification:connected': (payload: {
        socketId: string
        connectedAt: string
    }) => void
}

interface ClientToServerEvents {
    'notification:ping': (acknowledge: (payload: { timestamp: string }) => void) => void
}

const apiUrl = new URL(
    import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1',
    window.location.origin,
)
const apiPath = apiUrl.pathname.replace(/\/$/, '')

type SocketContextType = {
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
}

const SocketContext = createContext<SocketContextType | null>(null)

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)

    useEffect(() => {
        const notificationSocket = io(apiUrl.origin, {
            path: `${apiPath}/notifications/socket.io`,
            transports: ['websocket'],
            withCredentials: true,
            autoConnect: false,
        })

        const handleConnected = ({ socketId }: { socketId: string }) => {
            console.info(`[Socket.IO] Connected: ${socketId}`)
        }

        const handleError = (error: Error) => {
            console.error('[Socket.IO] Connection failed:', error)
        }

        notificationSocket.on('notification:connected', handleConnected)
        notificationSocket.on('connect_error', handleError)
        notificationSocket.connect()
        setSocket(notificationSocket)

        return () => {
            notificationSocket.off('notification:connected', handleConnected)
            notificationSocket.off('connect_error', handleError)
            notificationSocket.disconnect()
        }
    }, [])

    const memoizedValue = useMemo(() => ({
        socket
    }), [socket])

    return <SocketContext.Provider value={memoizedValue}>{children}</SocketContext.Provider>
}

const useSocketContext = () => {
    const context = useContext(SocketContext)
    if (!context) throw new Error('useSocketContext context must be use inside SocketProvider')
    return context
}

export { SocketProvider, useSocketContext }
