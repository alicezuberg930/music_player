export type User = {
    id: string
    fullname: string
    phone: string | null
    avatar: string | null
    birthday: string | null
    email: string;
    createdAt: string
    updatedAt: string
}

export type SongType = 'uploaded' | 'favorite'

export type PlaylistType = 'created' | 'favorite'