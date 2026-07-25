import { Request, Response } from "express"
import { and, db, desc, eq } from "@yukikaze/db"
import { notifications, pushNotifications, users } from "@yukikaze/db/schemas"
import { BadRequestException, HttpException, NotFoundException } from "@yukikaze/lib/exception"
import webpush from "web-push"
import { CreateNotificationInput, PushNotification, WebPushSubscription } from "./notification.model"

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

export class NotificationService {
    public async getNotifications(request: Request, response: Response) {
        try {
            if (!request.userId) throw new BadRequestException("User ID is missing in request")
            const data = await db.query.notifications.findMany({
                where: eq(notifications.toUserId, request.userId),
                orderBy: [desc(notifications.createdAt)],
            })
            return response.json({ message: "Notifications fetched successfully", data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async sendNotification(request: Request<{}, {}, CreateNotificationInput>, response: Response) {
        try {
            const { title, content, type, toUserId, uniqueKey, link, icon, refID, metaData } = request.body
            if (!title || !content || !type || !toUserId) {
                throw new BadRequestException("title, content, type and toUserId are required")
            }
            const targetUser = await db.query.users.findFirst({
                where: eq(users.id, toUserId),
                columns: { id: true },
            })
            if (!targetUser) throw new NotFoundException("User not found")

            const [notification] = await db.insert(notifications).values({
                title,
                content,
                type,
                toUserId,
                uniqueKey,
            }).$returningId()
            if (!notification) throw new BadRequestException("Unable to create notification")

            const savedNotification = await db.query.notifications.findFirst({
                where: eq(notifications.id, notification.id),
            })
            if (!savedNotification) throw new BadRequestException("Unable to create notification")

            const subscriptions = await db.query.pushNotifications.findMany({
                where: eq(pushNotifications.userId, toUserId),
            })

            const payload = JSON.stringify({
                title: savedNotification.title,
                body: savedNotification.content,
                icon: icon || "/web-app-manifest-192x192.png",
                link: link || "/",
                type: savedNotification.type,
                data: JSON.stringify({
                    refID: refID || savedNotification.id,
                    metaData,
                    time: savedNotification.time.toISOString(),
                    uniqueKey: savedNotification.uniqueKey,
                }),
            })

            const results = await this.sendWebPushToSubscriptions(subscriptions, payload)

            return response.json({
                message: "Notification created and sent successfully",
                data: {
                    notification: savedNotification,
                    sent: results.sent,
                    failed: results.failed,
                },
            })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async subscribe(request: Request, response: Response) {
        try {
            if (!request.userId) throw new BadRequestException("User ID is missing in request")
            const subscription = normalizeSubscription(request.body)
            const existingSubscription = await db.query.pushNotifications.findFirst({
                where: and(
                    eq(pushNotifications.userId, request.userId),
                    eq(pushNotifications.endPoint, subscription.endpoint),
                ),
            })
            if (existingSubscription) {
                await db.update(pushNotifications).set({
                    p256dh: subscription.keys!.p256dh!,
                    auth: subscription.keys!.auth!,
                    ip: request.ip,
                }).where(eq(pushNotifications.id, existingSubscription.id))
                return response.json({ message: "Push notification subscription updated successfully", data: existingSubscription.id })
            }

            const [createdSubscription] = await db.insert(pushNotifications).values({
                userId: request.userId,
                endPoint: subscription.endpoint,
                p256dh: subscription.keys!.p256dh!,
                auth: subscription.keys!.auth!,
                ip: request.ip,
            }).$returningId()
            if (!createdSubscription) throw new BadRequestException("Unable to create push notification subscription")

            return response.json({ message: "Push notification subscription created successfully", data: createdSubscription.id })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async unsubscribe(request: Request<{ id: string }>, response: Response) {
        try {
            if (!request.userId) throw new BadRequestException("User ID is missing in request")
            const { id } = request.params
            await db.delete(pushNotifications).where(and(
                eq(pushNotifications.id, id),
                eq(pushNotifications.userId, request.userId),
            ))
            return response.json({ message: "Push notification subscription removed successfully" })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    private async sendWebPushToSubscriptions(subscriptions: PushNotification[], payload: string) {
        if (subscriptions.length === 0) return { sent: 0, failed: 0 }
        configureWebPush()

        const results = await Promise.allSettled(
            subscriptions.map((subscription) => webpush.sendNotification(
                toWebPushSubscription(subscription),
                payload,
                { TTL: 60 },
            )),
        )

        return results.reduce((acc, result) => {
            if (result.status === "fulfilled") acc.sent += 1
            else {
                acc.failed += 1
                console.error("Failed to send web push notification:", result.reason)
            }
            return acc
        }, { sent: 0, failed: 0 })
    }
}
