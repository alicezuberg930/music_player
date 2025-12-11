import { playlists, songs, users } from "../../db/schemas"

export type User = typeof users.$inferSelect & {
    songs?: typeof songs.$inferSelect[]
    playlists?: typeof playlists.$inferSelect[]
    userFavoriteSongs?: typeof songs.$inferSelect[]
    userFavoritePlaylists?: typeof playlists.$inferSelect[]
}