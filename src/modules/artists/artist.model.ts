import { artists, playlists, songs } from "../../db/schemas"

export type Artist = typeof artists.$inferSelect
    & { songs?: typeof songs.$inferSelect[] }
    & { playlists?: typeof playlists.$inferSelect[] }