import type { pushNotifications } from "@yukikaze/db/schemas"

type PushNotification = typeof pushNotifications.$inferSelect

export type SendWebPushToSubscriptions = (
    subscriptions: PushNotification[],
    payload: string,
) => Promise<unknown>

export type CommentReplyEvent = {
    type: "comment.reply.created"
    commentId: string
    songId: string
    parentCommentId: string
    actorUserId: string
    actorFullName: string
    actorAvatar?: string
    content: string
    threadUserIds: string[]
    occurredAt: string
}

export type ChatMessageEvent = {
    type: "chat.message.created"
    chatId: string
    fromUserId: string
    toUserId: string
    actorFullName: string
    actorAvatar?: string
    content: string
    occurredAt: string
}

export type SocialNotification = {
    type: "comment" | "chat"
    title: string
    content: string
    refId: string
    refName: string
    link: string
    emittedAt: string
    toUserId: string
    actorUserId: string
    actorFullName: string
    actorAvatar?: string
}
