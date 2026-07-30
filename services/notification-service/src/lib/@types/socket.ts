import { ScheduledNotification } from "./notification"

export type ServerToClientEvents = {
    'notification:connected': (payload: {
        socketId: string
        connectedAt: string
    }) => void
    'notification:scheduled': (payload: ScheduledNotification) => void
    'notification:comment': (payload: ScheduledNotification & {
        type: "comment"
        toUserId: string
        actorUserId: string
        actorFullName: string
        actorAvatar?: string
    }) => void
    'notification:chat': (payload: ScheduledNotification & {
        type: "chat"
        toUserId: string
        actorUserId: string
        actorFullName: string
        actorAvatar?: string
    }) => void
}

export type ClientToServerEvents = {
    'notification:ping': (
        acknowledge: (payload: { timestamp: string }) => void
    ) => void
}
