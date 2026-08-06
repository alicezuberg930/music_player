import * as z from 'zod'

export namespace SocialValidators {
    export const createCommentInput = z.object({
        songId: z.string('songId is required'),
        content: z.string('Content is required').min(1, 'Content must not be empty'),
        parentCommentId: z.string().optional(),
    })
    export type CreateCommentInput = z.infer<typeof createCommentInput>

    export const getCommentsInput = z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
    })
    export type GetCommentsInput = z.infer<typeof getCommentsInput>

    export const getConversationsInput = z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
    })
    export type GetConversationsInput = z.infer<typeof getConversationsInput>

    export const sendChatInput = z.object({
        toUserId: z.string('Recipient user id is required'),
        content: z.string('Content is required').min(1, 'Content must not be empty'),
    })
    export type SendChatInput = z.infer<typeof sendChatInput>
}
