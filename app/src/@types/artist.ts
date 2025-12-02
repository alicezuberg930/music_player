import type { Playlist } from "./playlist"
import type { Song } from "./song"
import type { Video } from "./video"

export type Artist = {
    id: string
    name: string
    alias: string
    thumbnail: string
    likes: number
    totalFollow: number
    biography: string
    topAlbum: Playlist
    songs: Song[]
    playlists: Playlist[]
    videos: Video[]
    recommendedArtists?: Omit<Artist, 'recommendedArtists' | 'songs' | 'topAlbum' | 'playlists' | 'videos'>[]
}