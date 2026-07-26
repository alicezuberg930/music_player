import type { Query } from "."

export type Notification = {
    id: string
    title: string
    content: string
    type: string
    time: string
    isRead: boolean
    uniqueKey: string
    createdAt: string
    updatedAt: string
}

export type QueryNotification = Query & {
}