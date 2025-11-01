import { index, mysqlTable, int, varchar, boolean, text, date } from "drizzle-orm/mysql-core";
import { songs, artists } from ".";
import { relations } from "drizzle-orm";

export const artistsSongs = mysqlTable("artists_songs", {
    id: int().primaryKey().autoincrement(),
    artistId: int().references(() => artists.id, { onDelete: "set null" }),
    songId: int().references(() => songs.id, { onDelete: "set null" }),
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
