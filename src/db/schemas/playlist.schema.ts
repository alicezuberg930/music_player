import { index, mysqlTable, int, varchar, boolean, text, date } from "drizzle-orm/mysql-core"
import { createdAt, updatedAt } from "../utils"
import { relations } from "drizzle-orm"
import { songs, artists, users } from "./"

// playlist table
export const playlists = mysqlTable("playlists", {
    id: int().primaryKey().notNull().autoincrement(),
    title: varchar({ length: 255 }).notNull(),
    artistNames: varchar({ length: 255 }).notNull(),
    isWorldWide: boolean().default(false),
    thumbnail: text().notNull(),
    isPrivate: boolean().default(false),
    releaseDate: date({ mode: 'string' }),
    description: text(),
    isIndie: boolean().default(false),
    userId: int().notNull().references(() => users.id, { onDelete: "restrict" }),
    totalDuration: int().default(0),
    likes: int().default(0),
    listens: int().default(0),
    liked: boolean().default(false),
    comments: int().default(0),
    createdAt,
    updatedAt
}, (t) => [
    index('playlists_user_id_idx').on(t.userId),
    index('playlists_title_idx').on(t.title)
])

// playlist relationship with user and artist
export const playlistsRelations = relations(playlists, ({ one, many }) => ({
    user: one(users, {
        fields: [playlists.userId],
        references: [users.id],
    }),
    artists: many(playlistArtists),
    songs: many(playlistSongs)
}))

// playlist_artist table
export const playlistArtists = mysqlTable("playlist_artists", {
    id: int().primaryKey().notNull().autoincrement(),
    playlistId: int().references(() => playlists.id, { onDelete: "cascade" }),
    artistId: int().references(() => artists.id, { onDelete: "set null" }),
}, (t) => [
    index('playlist_id_idx').on(t.playlistId),
    index('artist_id_idx').on(t.artistId)
])

// playlist_artist relationship with playlist and artist
export const playlistArtistsRelations = relations(playlistArtists, ({ one }) => ({
    playlist: one(playlists, {
        fields: [playlistArtists.playlistId],
        references: [playlists.id],
    }),
    artist: one(artists, {
        fields: [playlistArtists.artistId],
        references: [artists.id],
    })
}))

// playlist_songs table
export const playlistSongs = mysqlTable("playlist_songs", {
    id: int().primaryKey().notNull().autoincrement(),
    playlistId: int().notNull().references(() => playlists.id, { onDelete: "cascade" }),
    songId: int().notNull().references(() => songs.id, { onDelete: "cascade" }),
}, (t) => [
    index('playlist_id_idx').on(t.playlistId),
    index('song_id_idx').on(t.songId)
])

// playlist_songs relationship with playlist and song
export const playlistSongsRelations = relations(playlistSongs, ({ one }) => ({
    playlist: one(playlists, {
        fields: [playlistSongs.playlistId],
        references: [playlists.id],
    }),
    song: one(songs, {
        fields: [playlistSongs.songId],
        references: [songs.id],
    })
}))
