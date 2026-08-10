import type { Request, Response } from 'express'
import { and, asc, eq, or } from '@yukikaze/db'
import { db } from '@yukikaze/db'
import { chats, users } from '@yukikaze/db/schemas'
import type { ChatMessageEvent } from '@yukikaze/kafka/types'
import { emitChatMessageEvent } from '@yukikaze/kafka/producer'
import { HttpException, BadRequestException, NotFoundException } from '@yukikaze/lib/exception'
import { QueryConversationsInput, SendChatInput } from '@yukikaze/validator'

export class ChatService {
    public async sendChatMessage(
        request: Request<{}, {}, SendChatInput>,
        response: Response,
    ) {
        try {
            const { toUserId, content } = request.body
            const fromUserId = request.userId
            if (!fromUserId) throw new BadRequestException("User is required")
            if (fromUserId === toUserId) throw new BadRequestException("Cannot send message to yourself")

            const recipient = await db.query.users.findFirst({
                where: eq(users.id, toUserId),
                columns: { id: true },
            })
            if (!recipient) throw new NotFoundException("Recipient not found")
            const actor = await db.query.users.findFirst({
                where: eq(users.id, fromUserId),
                columns: { id: true, fullname: true, avatar: true },
            })
            if (!actor) throw new NotFoundException("Actor not found")

            const [createdChat] = await db.insert(chats).values({
                fromUserId,
                toUserId,
                content,
            }).$returningId()
            if (!createdChat) throw new BadRequestException("Unable to create chat message")
            const payload: ChatMessageEvent = {
                type: "chat.message.created",
                chatId: createdChat.id,
                fromUserId,
                toUserId,
                actorFullName: actor.fullname,
                actorAvatar: actor.avatar ?? '',
                content,
                occurredAt: new Date().toISOString(),
            }
            emitChatMessageEvent(payload).catch((error) => {
                console.error('[Kafka] Failed to emit chat message event:', error)
            })

            return response.status(201).json({ message: 'Message sent successfully', data: createdChat })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async listConversation(
        request: Request<{ userId: string }, {}, {}, QueryConversationsInput>,
        response: Response,
    ) {
        try {
            const userId = request.userId
            const { userId: toUserId } = request.params
            if (!userId) throw new BadRequestException("User is required")
            if (userId === toUserId) throw new BadRequestException("Cannot get conversation with yourself")

            const { page = '1', limit = '50' } = request.query
            const currentPage = Number(page)
            const pageSize = Number(limit)

            const data = await db.query.chats.findMany({
                where: or(
                    and(eq(chats.fromUserId, userId), eq(chats.toUserId, toUserId)),
                    and(eq(chats.fromUserId, toUserId), eq(chats.toUserId, userId)),
                ),
                orderBy: [asc(chats.createdAt)],
                limit: pageSize,
                offset: (currentPage - 1) * pageSize,
            })

            return response.json({
                message: 'Conversation fetched successfully',
                data,
            })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}
