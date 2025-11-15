import { playlists, playlistSongs, songs, users } from "../../db/schemas"
import { Artist } from "../artists/artist.model"

export type CreatePlayList = typeof playlists.$inferInsert

export type PlayList = typeof playlists.$inferSelect
    & { songs?: typeof songs.$inferSelect[] }
    & { artists?: Artist[] }
    & { user: Omit<typeof users.$inferSelect, 'password' | 'email'> }

export type PlaylistSongs = typeof playlistSongs.$inferSelect