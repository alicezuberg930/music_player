import { mysqlTable, varchar, boolean, int, text, index, primaryKey } from "drizzle-orm/mysql-core"
import { createdAt, updatedAt } from "../utils"
import { createId } from "@yukikaze/lib/create-cuid"
import { relations } from "drizzle-orm"
import { artistsSongs, playlistArtists, users } from "./"

export const artists = mysqlTable("artists", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    name: varchar({ length: 255 }).notNull(),
    spotlight: boolean().default(false),
    alias: varchar({ length: 255 }),
    description: varchar({ length: 255 }),
    thumbnail: text(),
    totalFollow: int().default(0),
    createdAt,
    updatedAt,
})

export const artistsRelations = relations(artists, ({ one, many }) => ({
    songs: many(artistsSongs),
    playlists: many(playlistArtists),
    followers: many(artistFollowers),
}))

export const artistFollowers = mysqlTable("artist_followers", {
    artistId: varchar({ length: 36 }).notNull().references(() => artists.id, { onDelete: "cascade" }),
    userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
}, (t) => [
    primaryKey({ columns: [t.artistId, t.userId] }),
    index('artist_id_idx').on(t.artistId),
    index('user_id_idx').on(t.userId),
])

export const artistFollowersRelations = relations(artistFollowers, ({ one }) => ({
    user: one(users, {
        fields: [artistFollowers.userId],
        references: [users.id],
    }),
    artist: one(artists, {
        fields: [artistFollowers.artistId],
        references: [artists.id],
    })
}))