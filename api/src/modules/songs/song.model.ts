import { artists, genres, songs, users } from "../../db/schemas"

export type Song = typeof songs.$inferSelect
    & { user?: Omit<typeof users.$inferSelect, 'password' | 'email'> }
    & { genres?: typeof genres.$inferSelect[] }
    & { artists?: typeof artists.$inferSelect[] }

export type CreateSong = typeof songs.$inferInsert