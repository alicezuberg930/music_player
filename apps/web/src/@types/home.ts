import type { Artist } from "./artist"
import type { Banner } from "./banner"
import type { Playlist } from "./playlist"
import type { Song } from "./song"

export type HomeData = {
    banners: Banner[],
    newReleaseSongs: Song[],
    weeklyTopArtists: Artist[]
    newPlaylists: Playlist[]
}