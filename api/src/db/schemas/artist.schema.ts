import { mysqlTable, varchar, boolean, int, text } from "drizzle-orm/mysql-core"
import { createdAt, createId, updatedAt } from "../utils"
import { relations } from "drizzle-orm"
import { artistsSongs, playlistArtists } from "./"

export const artists = mysqlTable("artists", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    name: varchar({ length: 255 }).notNull(),
    spotlight: boolean().default(false),
    alias: varchar({ length: 255 }),
    thumbnail: text(),
    totalFollow: int().default(0),
    createdAt,
    updatedAt,
})

export const artistsRelations = relations(artists, ({ one, many }) => ({
    songs: many(artistsSongs),
    playlists: many(playlistArtists),
}))