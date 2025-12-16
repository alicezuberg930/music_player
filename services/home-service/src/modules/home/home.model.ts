import { artists, banners, playlists, songs } from "@yukikaze/db/schemas"

export type Song = typeof songs.$inferSelect

export type Banner = typeof banners.$inferSelect

export type Artist = typeof artists.$inferSelect

export type Playlist = typeof playlists.$inferSelect

export type HomeData = {
    banners: Banner[],
    newReleaseSongs: Song[],
    weeklyTopArtists: Artist[]
    newPlaylists: Playlist[]
}