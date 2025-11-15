import { index, mysqlTable, int, varchar, boolean, text, date } from "drizzle-orm/mysql-core"
import { createdAt, updatedAt } from "../utils"
import { relations } from "drizzle-orm"
import { artistsSongs, users } from "./"

export const songs = mysqlTable("songs", {
    id: int().primaryKey().notNull().autoincrement(),
    title: varchar({ length: 255 }).notNull(),
    alias: varchar({ length: 255 }).notNull(),
    artistNames: varchar({ length: 255 }).notNull(),
    isWorldWide: boolean().default(false),
    thumbnail: text().notNull(),
    lyricsFile: text(),
    duration: int().notNull(),
    isPrivate: boolean().default(false),
    releaseDate: date({ mode: 'string' }).default(new Date().toISOString().split('T')[0]),
    distributor: varchar({ length: 255 }),
    stream: varchar({ length: 255 }),
    isIndie: boolean().default(false),
    mvlink: varchar({ length: 500 }),
    hasLyrics: boolean().default(false),
    userId: int().notNull().references(() => users.id, { onDelete: "restrict" }),
    likes: int().default(0),
    listens: int().default(0),
    liked: boolean().default(false),
    comments: int().default(0),
    size: int().notNull(),
    createdAt,
    updatedAt
}, (t) => [
    index('songs_user_id_idx').on(t.userId),
    index('songs_title_idx').on(t.title)
])

export const songsRelations = relations(songs, ({ one, many }) => ({
    user: one(users, {
        fields: [songs.userId],
        references: [users.id],
    }),
    artists: many(artistsSongs),
    genres: many(songGenres)
}))

// genres table
export const genres = mysqlTable("genres", {
    id: int().primaryKey().notNull().autoincrement(),
    name: varchar({ length: 255 }).notNull(),
    alias: varchar({ length: 255 }),
    createdAt,
    updatedAt,
})

export const genresRelations = relations(genres, ({ many }) => ({
    songs: many(songGenres)
}))

// song_genres table
export const songGenres = mysqlTable("song_genres", {
    id: int().primaryKey().notNull().autoincrement(),
    genreId: int().notNull().references(() => genres.id, { onDelete: "cascade" }),
    songId: int().notNull().references(() => songs.id, { onDelete: "cascade" }),
}, (t) => [
    index('genre_id_idx').on(t.genreId),
    index('song_id_idx').on(t.songId)
])

export const songGenresRelations = relations(songGenres, ({ one }) => ({
    genre: one(genres, {
        fields: [songGenres.genreId],
        references: [genres.id],
    }),
    song: one(songs, {
        fields: [songGenres.songId],
        references: [songs.id],
    }),
}))