import { Request, Response } from "express"
import { and, db, desc, eq, inArray } from "@yukikaze/db"
import { notifications, pushNotifications, users } from "@yukikaze/db/schemas"
import { BadRequestException, HttpException, NotFoundException, UnauthorizedException } from "@yukikaze/lib/exception"
import { CreateNotificationInput } from "./notification.model"
import { normalizeSubscription, sendWebPushToSubscriptions } from "../../lib/utils"
import { QueryNotificationParams, ReadNotificationParams } from "@yukikaze/validator"
import { extractUA } from "@yukikaze/lib/extract-ua"

export class NotificationService {
    public async getNotifications(request: Request<{}, {}, {}, QueryNotificationParams>, response: Response) {
        try {
            if (!request.userId) throw new UnauthorizedException('User is not logged in')
            let { page, limit } = request.query
            let currentPage = 1
            let currentLimit = 15
            if (page) currentPage = Number(page)
            if (limit) currentLimit = Number(limit)

            const condition = eq(notifications.toUserId, request.userId)
            const total = await db.$count(notifications, condition)
            const totalPages = Math.ceil(total / currentLimit)

            if (!request.userId) throw new BadRequestException("User ID is missing in request")
            const data = await db.query.notifications.findMany({
                limit: currentLimit,
                offset: (currentPage - 1) * currentLimit,
                where: condition,
                orderBy: [desc(notifications.createdAt)],
            })
            return response.json({
                message: "Notifications fetched successfully",
                data,
                paginate: {
                    limit: currentLimit,
                    currentPage,
                    totalPages,
                }
            })
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

            const results = await sendWebPushToSubscriptions(subscriptions, payload)

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
            const userAgent = extractUA(request.get('user-agent'))
            const subscription = normalizeSubscription(request.body)
            const existingSubscription = await db.query.pushNotifications.findFirst({
                where: and(
                    eq(pushNotifications.userId, request.userId),
                    eq(pushNotifications.ip, request.ip!),
                    eq(pushNotifications.browser, userAgent.browser.name),
                    eq(pushNotifications.device_type, userAgent.device.type),
                    eq(pushNotifications.device_vendor, userAgent.device.vendor),
                    eq(pushNotifications.device_model, userAgent.device.model),
                ),
            })
            if (existingSubscription) {
                await db.update(pushNotifications).set({
                    p256dh: subscription.keys!.p256dh!,
                    auth: subscription.keys!.auth!,
                }).where(eq(pushNotifications.id, existingSubscription.id))
                return response.json({ message: "Push notification subscription updated successfully", data: existingSubscription.id })
            }

            const [createdSubscription] = await db.insert(pushNotifications).values({
                userId: request.userId,
                endPoint: subscription.endpoint,
                p256dh: subscription.keys!.p256dh!,
                auth: subscription.keys!.auth!,
                ip: request.ip,
                browser: userAgent.browser.name,
                cpu: userAgent.cpu.architecture,
                os: `${userAgent.os.name} ${userAgent.os.version ?? ''}`.trim(),
                device_type: userAgent.device.type,
                device_model: userAgent.device.model,
                device_vendor: userAgent.device.vendor,
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

    public async countUnreadNotifications(request: Request, response: Response) {
        try {
            if (!request.userId) throw new BadRequestException("User ID is missing in request")
            const data = await db.$count(notifications,
                and(eq(notifications.toUserId, request.userId), eq(notifications.isRead, false))
            )
            return response.json({ message: "Unred notifications counted", data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async readNotifications(request: Request<{}, {}, ReadNotificationParams>, response: Response) {
        try {
            if (!request.userId) throw new BadRequestException("User ID is missing in request")
            const { ids } = request.body
            await db.update(notifications).set({ isRead: true }).where(inArray(notifications.id, ids))
            return response.json({ message: "Notification read successfully" })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}
