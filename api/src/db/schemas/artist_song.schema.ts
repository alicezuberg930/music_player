import { index, mysqlTable, int } from "drizzle-orm/mysql-core"
import { songs, artists } from "./"
import { relations } from "drizzle-orm"

export const artistsSongs = mysqlTable("artists_songs", {
    id: int().primaryKey().notNull().autoincrement(),
    artistId: int().notNull().references(() => artists.id, { onDelete: "cascade" }),
    songId: int().notNull().references(() => songs.id, { onDelete: "cascade" }),
}, (t) => [
    index('artist_id_idx').on(t.artistId),
    index('song_id_idx').on(t.songId),
])

export const artistsSongsRelations = relations(artistsSongs, ({ one }) => ({
    song: one(songs, {
        fields: [artistsSongs.songId],
        references: [songs.id],
    }),
    artist: one(artists, {
        fields: [artistsSongs.artistId],
        references: [artists.id],
    })
}))