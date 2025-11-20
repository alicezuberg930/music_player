import type { Song } from "./song"

export type Playlist = {
    id: string
    title: string
    thumbnail: string
    description: string
    songs: Song[]
    isAlbum: boolean
    artistNames: string
    releaseDate?: string
    likes: number
    totalDuration: number
    listens: number
    liked: boolean
    createdAt: string
    updatedAt: string
}