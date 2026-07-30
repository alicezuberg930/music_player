import { comments, users } from "@yukikaze/db/schemas"

export type Comment = typeof comments.$inferSelect

export type PublicUser = Omit<typeof users.$inferSelect, 'password' | 'email'>

export type CommentWithUser = Omit<Comment, "userId"> & {
    user: PublicUser
}

export type CommentWithChildren = CommentWithUser & {
    replies: CommentWithChildren[]
}
