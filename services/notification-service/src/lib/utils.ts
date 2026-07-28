import { PushNotification, WebPushSubscription } from "@/modules/notifications/notification.model"
import { BadRequestException } from "@yukikaze/lib/exception"
import { db, inArray, sql } from "@yukikaze/db"
import { artists, notifications, playlists, pushNotifications, songs } from "@yukikaze/db/schemas"
import webpush from "web-push"
import { NotificationType, ScheduledNotification } from "./@types/notification"
import { Server } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents } from "./@types/socket"

const vapidSubject = process.env.WEB_PUSH_SUBJECT!
const vapidPublicKey = process.env.WEB_PUSH_PUBLIC_KEY
const vapidPrivateKey = process.env.WEB_PUSH_PRIVATE_KEY

let isWebPushConfigured = false

const configureWebPush = () => {
    if (isWebPushConfigured) return
    if (!vapidPublicKey || !vapidPrivateKey) {
        throw new BadRequestException("Web push VAPID keys are not configured")
    }
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)
    isWebPushConfigured = true
}

const normalizeSubscription = (input: unknown): WebPushSubscription => {
    const subscription = typeof input === "string" ? JSON.parse(input) : input
    if (!subscription || typeof subscription !== "object") {
        throw new BadRequestException("Invalid push subscription")
    }
    const { endpoint, keys } = subscription as WebPushSubscription
    if (!endpoint || !keys?.p256dh || !keys.auth) {
        throw new BadRequestException("Invalid push subscription keys")
    }
    return { endpoint, keys }
}

const toWebPushSubscription = (subscription: PushNotification) => ({
    endpoint: subscription.endPoint,
    keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
    },
})

const notificationContents = [
    {
        type: 'song',
        title: 'A new song has been released',
        content: (name: string, meta: string) => `Fresh track "${name}" by ${meta}`,
        link: (id: string) => `/song/${id}`,
        resolveId: (id: string) => id,
    },
    {
        type: 'playlist',
        title: 'A new playlist for you today',
        content: (name: string, _meta: string) => `A curated playlist "${name}" is waiting for you`,
        link: (id: string) => `/playlist/${id}`,
        resolveId: (id: string) => id,
    },
    {
        type: 'artist',
        title: 'Have you heard of this artist',
        content: (name: string, _meta: string) => `Spotlight artist: ${name}`,
        link: (id: string) => `/artist/${id}`,
        resolveId: (id: string) => id,
    },
]

const getRandomRow = async <T>(query: () => Promise<T[]>) => {
    const rows = await query()
    return rows[0] || null
}

const getRandomItemByType = async (type: NotificationType) => {
    switch (type) {
        case "song":
            return getRandomRow(async () =>
                db.select({
                    id: songs.id,
                    name: songs.title,
                    meta: songs.artistNames,
                    thumbnail: songs.thumbnail,
                }).from(songs).orderBy(sql`RAND()`).limit(1)
            )
        case "playlist":
            return getRandomRow(async () =>
                db.select({
                    id: playlists.id,
                    name: playlists.title,
                    meta: playlists.artistNames,
                    thumbnail: playlists.thumbnail,
                }).from(playlists).orderBy(sql`RAND()`).limit(1)
            )
        case "artist":
            return getRandomRow(async () =>
                db.select({
                    id: artists.id,
                    name: artists.name,
                    meta: artists.alias,
                    thumbnail: artists.thumbnail,
                }).from(artists).orderBy(sql`RAND()`).limit(1)
            )
        default:
            return Promise.resolve(null)
    }
}

const periodicNotificationMessage = async (): Promise<ScheduledNotification | null> => {
    const now = new Date().toISOString()
    console.log(`[${now}] Cron job executed`)

    try {
        const scheduledItem = notificationContents.sort(() => Math.random() - 0.5)[0]
        if (!scheduledItem) return null
        const media = await getRandomItemByType(scheduledItem.type as NotificationType)
        if (!media) {
            console.warn(`[${now}] No random ${scheduledItem.type} item found, skipped`)
            return null
        }
        const payload: ScheduledNotification = {
            type: scheduledItem.type as NotificationType,
            title: scheduledItem.title,
            content: scheduledItem.content(media.name, media.meta || ""),
            refId: scheduledItem.resolveId(media.id),
            refName: media.name,
            refMeta: media.meta ?? undefined,
            link: scheduledItem.link(scheduledItem.resolveId(media.id)),
            thumbnail: media.thumbnail,
            emittedAt: now,
        }
        return payload
    } catch (error) {
        console.error('Cron job failed:', error)
        return null
    }
}

const sendWebPushToSubscriptions = async (subscriptions: PushNotification[], payload: string) => {
    if (subscriptions.length === 0) return { sent: 0, failed: 0 }
    configureWebPush()

    const subscriptionsToDelete = new Set<string>()
    const results = await Promise.allSettled(
        subscriptions.map((subscription) => webpush.sendNotification(
            toWebPushSubscription(subscription),
            payload,
            { TTL: 60 },
        )),
    )

    const reduceResult = results.reduce((acc, result, index) => {
        const subscription = subscriptions[index]
        if (result.status === "fulfilled") {
            acc.sent += 1
            return acc
        }

        acc.failed += 1
        const reason: unknown = result.reason
        const statusCode = Number((reason && typeof reason === "object" && "statusCode" in reason) ? (reason as { statusCode?: number | string }).statusCode : 0)
        const isGone = statusCode === 404 || statusCode === 410
        const endpoint = (subscription && typeof subscription.endPoint === "string") ? subscription.endPoint : "unknown"
        console.error(
            `Failed to send web push notification (status: ${statusCode || "unknown"}, endpoint: ${endpoint}):`,
            reason,
        )
        if (isGone && subscription?.id) {
            subscriptionsToDelete.add(subscription.id)
        }
        return acc
    }, { sent: 0, failed: 0 } as { sent: number; failed: number })

    // delete all subscriptions in database if it expires
    if (subscriptionsToDelete.size > 0) {
        const ids = [...subscriptionsToDelete]
        try {
            await db.delete(pushNotifications).where(inArray(pushNotifications.id, ids))
            console.log(`[Cron] removed ${ids.length} expired push subscriptions`)
        } catch (error) {
            console.error("Failed to remove expired push subscriptions:", error)
        }
    }

    return reduceResult
}

const emitRealtimeNotification = async (io: Server<ClientToServerEvents, ServerToClientEvents>, payload: ScheduledNotification) => {
    if (!payload) return
    const subscriptions = await db.query.pushNotifications.findMany()
    const recipientUserIds = subscriptions.map((subscription) => subscription.userId)

    if (subscriptions.length === 0) {
        console.log("[Cron] no push subscriptions found")
        return
    }
    if (recipientUserIds.length === 0) {
        console.log("[Cron] no notification recipients found")
        return
    }

    try {
        await db.insert(notifications).values(
            recipientUserIds.map((toUserId) => ({
                title: payload.title,
                content: payload.content,
                type: payload.type,
                toUserId,
                uniqueKey: `scheduled:${payload.type}:${payload.refId}:${toUserId}:${payload.emittedAt}`,
            }))
        )
    } catch (error) {
        console.error("[Cron] failed to save scheduled notification:", error)
        return
    }

    io.emit('notification:scheduled', payload)

    const result = await sendWebPushToSubscriptions(
        subscriptions,
        JSON.stringify({
            title: payload.title,
            body: payload.content,
            icon: payload.thumbnail || "/web-app-manifest-192x192.png",
            link: payload.link,
            type: payload.type,
            data: JSON.stringify({
                refId: payload.refId,
                refName: payload.refName,
                refMeta: payload.refMeta,
                emittedAt: payload.emittedAt,
            }),
        }),
    )

    console.log(`[Cron] notification ${payload.type} - push sent/failed: ${result.sent}/${result.failed}`)
}

export {
    configureWebPush,
    normalizeSubscription,
    toWebPushSubscription,
    periodicNotificationMessage,
    sendWebPushToSubscriptions,
    emitRealtimeNotification
}
