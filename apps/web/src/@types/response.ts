import type { Artist } from "./artist"
import type { Playlist } from "./playlist"
import type { Song } from "./song"
import type { User } from "./user"
import type { Video } from "./video"

export type Response<T = Artist[] | Song[] | Playlist[] | Playlist | Artist | Song | Video | User> = {
    message: string
    data?: T
    statusCode?: number
    path?: string
    method?: string
    timestamp?: string
    paginate: {
        limit: number
        currentPage: number
        totalPages: number
    }
}