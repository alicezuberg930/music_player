import { ScheduledNotification } from "./notification"

export type ServerToClientEvents = {
    'notification:connected': (payload: {
        socketId: string
        connectedAt: string
    }) => void
    'notification:scheduled': (payload: ScheduledNotification) => void
}

export type ClientToServerEvents = {
    'notification:ping': (
        acknowledge: (payload: { timestamp: string }) => void
    ) => void
}