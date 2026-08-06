export type PublicUser = {
    id: string
    fullname: string
    avatar?: string | null
}

export type Comment = {
    id: string
    userId: string
    content: string
    parentCommentId: string | null
    songId: string
    likes: number | null
    createdAt: string
    updatedAt: string
    user: PublicUser
    replies: Comment[]
}