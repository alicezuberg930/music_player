import { readFileSync } from 'node:fs'
import { db, inArray } from '@yukikaze/db'
import { notifications, pushNotifications } from '@yukikaze/db/schemas'
import { env } from '@yukikaze/lib/create-env'
import { Kafka, type EachMessagePayload } from 'kafkajs'
import type { Server } from 'socket.io'
import type { ChatMessageEvent, CommentReplyEvent, SendWebPushToSubscriptions, SocialNotification } from './types'
import { getKafkaBrokers, isChatKafkaEnabled, isCommentKafkaEnabled, kafkaCaPem } from './utils'

let commentConsumer: ReturnType<Kafka['consumer']> | null = null
let chatConsumer: ReturnType<Kafka['consumer']> | null = null
let isStartingCommentConsumer = false
let isStartingChatConsumer = false

const parseCommentReplyEvent = (payload: string): CommentReplyEvent | null => {
    const raw = JSON.parse(payload) as CommentReplyEvent
    if (raw?.type !== "comment.reply.created") return null
    if (!raw.commentId || !raw.songId || !raw.actorUserId || !raw.actorFullName) return null
    if (!Array.isArray(raw.threadUserIds)) return null

    return raw
}

const parseChatMessageEvent = (payload: string): ChatMessageEvent | null => {
    const raw = JSON.parse(payload) as ChatMessageEvent
    if (raw?.type !== "chat.message.created") return null
    if (!raw.chatId || !raw.fromUserId || !raw.toUserId || !raw.actorFullName || !raw.content) return null

    return raw
}

const buildCommentNotificationPayload = (event: CommentReplyEvent, toUserId: string): SocialNotification => ({
    type: "comment",
    title: `${event.actorFullName} replied to a comment`,
    content: event.content,
    refId: event.parentCommentId,
    refName: event.songId,
    link: `/home`,
    emittedAt: event.occurredAt,
    toUserId,
    actorUserId: event.actorUserId,
    actorFullName: event.actorFullName,
    actorAvatar: event.actorAvatar,
})

const buildChatNotificationPayload = (event: ChatMessageEvent): SocialNotification => ({
    type: "chat",
    title: `${event.actorFullName} sent you a message`,
    content: event.content,
    refId: event.chatId,
    refName: event.actorFullName,
    link: `/home`,
    emittedAt: event.occurredAt,
    toUserId: event.toUserId,
    actorUserId: event.fromUserId,
    actorFullName: event.actorFullName,
    actorAvatar: event.actorAvatar,
})

const sendPushNotificationToRecipients = async (
    recipients: string[],
    payload: Omit<SocialNotification, 'toUserId'>,
    sendWebPushToSubscriptions: SendWebPushToSubscriptions,
) => {
    if (recipients.length === 0) return

    const rows = await db.query.pushNotifications.findMany({
        where: inArray(pushNotifications.userId, recipients),
    })
    if (rows.length === 0) return

    const webPushPayload = JSON.stringify({
        title: payload.title,
        body: payload.content,
        type: payload.type,
        link: payload.link,
        data: JSON.stringify({
            refId: payload.refId,
            refName: payload.refName,
            actorUserId: payload.actorUserId,
            actorFullName: payload.actorFullName,
            actorAvatar: payload.actorAvatar,
        }),
    })

    await sendWebPushToSubscriptions(rows, webPushPayload)
}

const emitNotificationToRecipient = (
    io: Server,
    payload: SocialNotification,
    event: 'notification:comment' | 'notification:chat',
) => {
    io.to(`user:${payload.toUserId}`).emit(event, payload)
}

const handleCommentReplyEvent = async (
    io: Server,
    rawEvent: CommentReplyEvent,
    sendWebPushToSubscriptions: SendWebPushToSubscriptions,
) => {
    const recipientUserIds = [...new Set(rawEvent.threadUserIds.filter((id) => id !== rawEvent.actorUserId))]
    if (recipientUserIds.length === 0) return

    const uniqueKeys = recipientUserIds.map((toUserId) => `comment:${rawEvent.commentId}:${toUserId}`)
    await db.insert(notifications).values(
        recipientUserIds.map((toUserId, index) => ({
            title: `${rawEvent.actorFullName} replied to a comment`,
            content: rawEvent.content,
            type: "comment",
            toUserId,
            uniqueKey: uniqueKeys[index],
        })),
    )

    recipientUserIds.forEach((toUserId) => {
        const payload = buildCommentNotificationPayload(rawEvent, toUserId)
        emitNotificationToRecipient(io, payload, 'notification:comment')
    })

    await sendPushNotificationToRecipients(
        recipientUserIds,
        buildCommentNotificationPayload(rawEvent, recipientUserIds[0] ?? ''),
        sendWebPushToSubscriptions,
    )
}

const handleChatMessageEvent = async (
    io: Server,
    event: ChatMessageEvent,
    sendWebPushToSubscriptions: SendWebPushToSubscriptions,
) => {
    if (event.fromUserId === event.toUserId) return
    const payload = buildChatNotificationPayload(event)

    await db.insert(notifications).values({
        title: payload.title,
        content: payload.content,
        type: "chat",
        toUserId: event.toUserId,
        uniqueKey: `chat:${event.chatId}:${event.toUserId}`,
    })
    emitNotificationToRecipient(io, payload, 'notification:chat')
    await sendPushNotificationToRecipients([event.toUserId], payload, sendWebPushToSubscriptions)
}

const createConsumer = (groupId: string): ReturnType<Kafka['consumer']> | null => {
    const brokers = getKafkaBrokers()
    if (brokers.length === 0) return null

    const kafka = new Kafka({
        clientId: env.KAFKA_CLIENT_ID || "notification-service",
        brokers,
        ssl: {
            ca: [kafkaCaPem]
        },
        sasl: {
            mechanism: "plain",
            username: env.KAFKA_SASL_USERNAME!,
            password: env.KAFKA_SASL_PASSWORD!,
        },
    })

    return kafka.consumer({ groupId })
}

const runCommentConsumer = async (
    io: Server,
    sendWebPushToSubscriptions: SendWebPushToSubscriptions,
) => {
    if (!isCommentKafkaEnabled || commentConsumer || isStartingCommentConsumer) return
    const brokers = getKafkaBrokers()
    if (brokers.length === 0) {
        console.warn("[Kafka] Comment reply consumer skipped (no brokers configured)")
        return
    }
    isStartingCommentConsumer = true
    const createdConsumer = createConsumer(env.KAFKA_COMMENT_REPLY_GROUP_ID || "notification-service-comment-reply")
    if (!createdConsumer) {
        isStartingCommentConsumer = false
        return
    }
    commentConsumer = createdConsumer

    try {
        await commentConsumer.connect()
        await commentConsumer.subscribe({ topic: env.KAFKA_COMMENT_REPLY_TOPIC!, fromBeginning: false })
        await commentConsumer.run({
            eachMessage: async ({ message }: EachMessagePayload) => {
                if (!message.value) return
                try {
                    const event = parseCommentReplyEvent(message.value.toString())
                    if (!event) return
                    await handleCommentReplyEvent(io, event, sendWebPushToSubscriptions)
                } catch (error) {
                    console.error('[Kafka] Failed to process comment.reply event:', error)
                }
            },
        })
        console.log('[Kafka] Comment reply consumer started')
    } catch (error) {
        console.error('[Kafka] Failed to start comment reply consumer:', error)
    } finally {
        isStartingCommentConsumer = false
    }
}

const runChatConsumer = async (
    io: Server,
    sendWebPushToSubscriptions: SendWebPushToSubscriptions,
) => {
    if (!isChatKafkaEnabled || chatConsumer || isStartingChatConsumer) return
    const brokers = getKafkaBrokers()
    if (brokers.length === 0) {
        console.warn("[Kafka] Chat message consumer skipped (no brokers configured)")
        return
    }
    isStartingChatConsumer = true
    const createdConsumer = createConsumer(env.KAFKA_CHAT_EVENTS_GROUP_ID || "notification-service-chat-message")
    if (!createdConsumer) {
        isStartingChatConsumer = false
        return
    }
    chatConsumer = createdConsumer

    try {
        await chatConsumer.connect()
        await chatConsumer.subscribe({ topic: env.KAFKA_CHAT_EVENTS_TOPIC!, fromBeginning: false })
        await chatConsumer.run({
            eachMessage: async ({ message }: EachMessagePayload) => {
                if (!message.value) return
                try {
                    const event = parseChatMessageEvent(message.value.toString())
                    if (!event) return
                    await handleChatMessageEvent(io, event, sendWebPushToSubscriptions)
                } catch (error) {
                    console.error('[Kafka] Failed to process chat.message event:', error)
                }
            },
        })
        console.log('[Kafka] Chat message consumer started')
    } catch (error) {
        console.error('[Kafka] Failed to start chat message consumer:', error)
    } finally {
        isStartingChatConsumer = false
    }
}

export const startKafkaConsumer = async (
    io: Server,
    sendWebPushToSubscriptions: SendWebPushToSubscriptions,
) => {
    if (!env.KAFKA_BROKERS) {
        console.warn("[Kafka] Consumers skipped (missing broker config)")
        return
    }

    const brokers = getKafkaBrokers()
    if (brokers.length === 0) {
        console.warn("[Kafka] Consumers skipped (no brokers configured)")
        return
    }

    if (!isCommentKafkaEnabled && !isChatKafkaEnabled) {
        console.warn("[Kafka] Consumers skipped (missing event topic config)")
        return
    }

    if (isCommentKafkaEnabled) await runCommentConsumer(io, sendWebPushToSubscriptions)
    if (isChatKafkaEnabled) await runChatConsumer(io, sendWebPushToSubscriptions)
}
