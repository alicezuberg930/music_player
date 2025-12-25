import { playlists, songs, users } from "@yukikaze/db/schemas"

export type Song = typeof songs.$inferSelect

export type Playlist = typeof playlists.$inferSelect

export type User = typeof users.$inferSelect & {
    songs?: Song[]
    playlists?: Playlist[]
    userFavoriteSongs?: Song[]
    userFavoritePlaylists?: Playlist[]
}