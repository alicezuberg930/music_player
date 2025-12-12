import { artists, playlists, playlistSongs, songs, users } from "@yukikaze/db/schemas"

export type CreatePlayList = typeof playlists.$inferInsert

export type PlayList = typeof playlists.$inferSelect
    & { songs?: typeof songs.$inferSelect[] }
    & { artists?: typeof artists.$inferSelect[] }
    & { user: Omit<typeof users.$inferSelect, 'password' | 'email'> }

export type PlaylistSongs = typeof playlistSongs.$inferSelect