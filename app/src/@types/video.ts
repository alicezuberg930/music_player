import type { Artist } from "./artist"

export type Video = {
    id: string
    stream: string
    title: string
    thumbnail: string
    artistNames: string
    duration: number
    mainArtist: Artist
    artists: Artist[]
    recommends: Video[]
}