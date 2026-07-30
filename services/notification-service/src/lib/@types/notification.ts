export type NotificationType = "song" | "playlist" | "artist" | "comment" | "chat"

export type Notification = {
    type: NotificationType
    title: string
    content: string
    refId: string
    refName: string
    link: string
    emittedAt: string
}

export type ScheduledNotification = Notification & {
    thumbnail?: string | null
}

export type SocialNotification = Notification & {
    toUserId: string
    actorUserId: string
    actorFullName: string
    actorAvatar?: string
}