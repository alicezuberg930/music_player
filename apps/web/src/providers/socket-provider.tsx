import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { io, type Socket } from 'socket.io-client'
import { toast } from "@yukikaze/ui"
import { getQueryClient } from "./query-client-provider"
import { useAuthContext } from "./auth-provider"

interface ServerToClientEvents {
    'notification:connected': (payload: {
        socketId: string
        connectedAt: string
    }) => void
    'notification:scheduled': (payload: {
        type: 'song' | 'playlist' | 'artist'
        title: string
        content: string
        refId: string
        refName: string
        refMeta?: string
        link: string
        thumbnail?: string | null
        emittedAt: string
    }) => void
    'notification:comment': (payload: {
        toUserId: string
        type: 'comment'
        actorFullName: string
        actorAvatar?: string
        title: string
        content: string
    }) => void
    'notification:chat': (payload: {
        toUserId: string
        type: 'chat'
        actorFullName: string
        actorAvatar?: string
        title: string
        content: string
    }) => void
}

interface ClientToServerEvents {
    'notification:ping': (acknowledge: (payload: { timestamp: string }) => void) => void
}

const apiUrl = new URL(import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1', window.location.origin)
const apiPath = apiUrl.pathname.replace(/\/$/, '')

type SocketContextType = {
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
}

const SocketContext = createContext<SocketContextType | null>(null)

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
    const queryClient = getQueryClient()
    const { user } = useAuthContext()

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

        const handleScheduledNotification = (payload: {
            type: 'song' | 'playlist' | 'artist'
            title: string
            content: string
        }) => {
            toast.info(payload.title, { description: payload.content })
            console.log(payload)
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] })
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        }

        const handleCommentNotification = (payload: {
            toUserId: string
            type: 'comment'
            actorFullName: string
            actorAvatar?: string
            title: string
            content: string
        }) => {
            if (user?.id && payload.toUserId !== user.id) return
            toast.success(payload.title, { description: payload.content })
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] })
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        }

        const handleChatNotification = (payload: {
            toUserId: string
            type: 'chat'
            actorFullName: string
            actorAvatar?: string
            title: string
            content: string
        }) => {
            if (user?.id && payload.toUserId !== user.id) return
            toast.info(payload.title, { description: payload.content })
            queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] })
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        }

        notificationSocket.on('notification:connected', handleConnected)
        notificationSocket.on('notification:scheduled', handleScheduledNotification)
        notificationSocket.on('notification:comment', handleCommentNotification)
        notificationSocket.on('notification:chat', handleChatNotification)
        notificationSocket.on('connect_error', handleError)
        notificationSocket.connect()
        setSocket(notificationSocket)

        return () => {
            notificationSocket.off('notification:connected', handleConnected)
            notificationSocket.off('notification:scheduled', handleScheduledNotification)
            notificationSocket.off('notification:comment', handleCommentNotification)
            notificationSocket.off('notification:chat', handleChatNotification)
            notificationSocket.off('connect_error', handleError)
            notificationSocket.disconnect()
        }
    }, [queryClient])

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
