import type { Comment } from "../modules/comments/comment.model"

export type CommentReplyEvent = {
    type: "comment.reply.created"
    commentId: string
    songId: string
    parentCommentId: string
    actorUserId: string
    actorFullName: string
    actorAvatar?: string
    content: Comment["content"]
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
    content: Comment["content"]
    occurredAt: string
}
