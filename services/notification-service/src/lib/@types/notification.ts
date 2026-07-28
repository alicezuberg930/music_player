export type NotificationType = "song" | "playlist" | "artist"

export type ScheduledNotification = {
    type: NotificationType
    title: string
    content: string
    refId: string
    refName: string
    refMeta?: string
    link: string
    thumbnail?: string | null
    emittedAt: string
}