import { playlists, songs, users } from "../../db/schemas"

export type User = typeof users.$inferSelect & {
    songs?: typeof songs.$inferSelect[]
    playlists?: typeof playlists.$inferSelect[]
}