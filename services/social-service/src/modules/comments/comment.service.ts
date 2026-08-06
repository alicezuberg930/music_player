import type { Request, Response } from 'express'
import { and, asc, eq, sql } from '@yukikaze/db'
import { db } from '@yukikaze/db'
import { comments, songs, users } from '@yukikaze/db/schemas'
import {
    HttpException,
    BadRequestException,
    NotFoundException
} from '@yukikaze/lib/exception'
import type { CommentReplyEvent } from '@yukikaze/kafka/types'
import { emitCommentReplyEvent } from '@yukikaze/kafka/producer'
import { SocialValidators } from '@yukikaze/validator'
import { CommentWithChildren, PublicUser } from './comment.model'

export class CommentService {
    private async collectThreadUserIds(parentCommentId: string): Promise<string[]> {
        const [rawRows] = await db.execute(sql`
        WITH RECURSIVE comment_thread AS (
            SELECT id, user_id, parent_comment_id
            FROM comments
            WHERE id = ${parentCommentId}
            UNION ALL
            SELECT c.id, c.user_id, c.parent_comment_id
            FROM comments c
            INNER JOIN comment_thread ct ON c.parent_comment_id = ct.id OR c.id = ct.parent_comment_id
        )
        SELECT DISTINCT user_id
        FROM comment_thread
    `)

        const rows: unknown = rawRows
        if (!Array.isArray(rows)) return []

        const userIds = rows
            .map((row: unknown) => {
                if (typeof row !== 'object' || row === null || !('user_id' in row)) {
                    return null
                }

                return row.user_id
            })
            .filter((id): id is string => typeof id === 'string' && id.length > 0)

        return [...new Set(userIds)]
    }

    public async createComment(request: Request<{}, {}, SocialValidators.CreateCommentInput>, response: Response) {
        try {
            const { songId, content, parentCommentId } = request.body
            const userId = request.userId
            if (!userId) throw new BadRequestException("User is required")

            const parent = parentCommentId && await db.query.comments.findFirst({
                where: and(eq(comments.id, parentCommentId), eq(comments.songId, songId)),
                columns: { id: true },
            })

            if (parentCommentId && !parent) {
                throw new BadRequestException("Parent comment not found")
            }

            const findSong = await db.query.songs.findFirst({
                where: eq(songs.id, songId),
                columns: { id: true },
            })
            if (!findSong) throw new NotFoundException('Song not found')

            const actor = await db.query.users.findFirst({
                where: eq(users.id, userId),
                columns: { id: true, fullname: true, avatar: true },
            })

            if (!actor) throw new NotFoundException('Actor not found')

            const [insertedComment] = await db.insert(comments).values({
                userId,
                songId,
                content,
                ...(parentCommentId ? { parentCommentId: parentCommentId } : {}),
            }).$returningId()

            if (!insertedComment) {
                throw new BadRequestException("Unable to create comment")
            }

            await db.update(songs).set({ comments: sql`${songs.comments} + 1` }).where(eq(songs.id, songId))

            if (parentCommentId) {
                const participantIds = await this.collectThreadUserIds(parentCommentId)
                const recipients = participantIds.filter((id) => id !== userId)
                if (recipients.length > 0) {
                    const payload: CommentReplyEvent = {
                        type: "comment.reply.created",
                        commentId: insertedComment.id!,
                        songId,
                        parentCommentId,
                        actorUserId: userId,
                        actorFullName: actor.fullname,
                        content,
                        threadUserIds: recipients,
                        occurredAt: new Date().toISOString(),
                        actorAvatar: actor.avatar ?? '',
                    }
                    emitCommentReplyEvent(payload).catch(console.error)
                }
            }

            return response.status(201).json({
                message: 'Comment created successfully',
                data: {
                    ...insertedComment,
                    user: {
                        id: actor.id,
                        fullname: actor.fullname,
                    },
                },
            })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async listComments(
        request: Request<{ songId: string }, {}, {}, SocialValidators.GetCommentsInput>,
        response: Response,
    ) {
        try {
            const { songId } = request.params
            const { page = '1', limit = '20' } = request.query
            const currentPage = Number(page)
            const pageSize = Number(limit)
            const findSong = await db.query.songs.findFirst({ where: eq(songs.id, songId), columns: { id: true } })
            if (!findSong) throw new NotFoundException('Song not found')

            const rows = await db.query.comments.findMany({
                where: eq(comments.songId, songId),
                orderBy: [asc(comments.createdAt)],
                with: {
                    user: {
                        columns: {
                            id: true,
                            fullname: true,
                            avatar: true,
                        },
                    },
                },
            })

            const all: CommentWithChildren[] = rows.map((item) => ({
                ...item,
                user: (item.user ?? null) as PublicUser,
                likes: item.likes ?? 0,
                replies: [],
            }))

            const commentMap = new Map<string, CommentWithChildren>()
            all.forEach((item) => commentMap.set(item.id, item))

            const topLevel: CommentWithChildren[] = []
            const children: CommentWithChildren[] = []

            all.forEach((item) => {
                if (!item.parentCommentId) {
                    topLevel.push(item)
                    return
                }
                const parent = commentMap.get(item.parentCommentId)
                if (parent) {
                    parent.replies.push(item)
                } else {
                    children.push(item)
                }
            })

            const merged = [...topLevel, ...children]
            const offset = (currentPage - 1) * pageSize
            const data = merged.slice(offset, offset + pageSize)

            return response.json({
                message: 'Comments fetched successfully',
                data,
                paginate: {
                    currentPage,
                    limit: pageSize,
                    totalPages: Math.ceil(merged.length / pageSize),
                },
            })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}
