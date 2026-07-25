import { notifications, pushNotifications } from "@yukikaze/db/schemas"

export type Notification = typeof notifications.$inferSelect

export type PushNotification = typeof pushNotifications.$inferSelect

export type WebPushSubscription = {
    endpoint: string
    keys?: {
        p256dh?: string
        auth?: string
    }
}

export type CreateNotificationInput = {
    title: string
    content: string
    type: string
    toUserId: string
    uniqueKey?: string
    link?: string
    icon?: string
    refID?: string
    metaData?: string
}
