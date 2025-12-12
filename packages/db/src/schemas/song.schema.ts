import { index, mysqlTable, int, varchar, boolean, text, date } from "drizzle-orm/mysql-core"
import { createdAt, updatedAt } from "../utils"
import { createId } from "@yukikaze/lib/create-cuid"
import { relations } from "drizzle-orm"
import { artistsSongs, genres, users } from "./"

export const songs = mysqlTable("songs", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    title: varchar({ length: 255 }).notNull(),
    alias: varchar({ length: 255 }).notNull(),
    artistNames: varchar({ length: 255 }).notNull(),
    isWorldWide: boolean().default(false),
    thumbnail: text().notNull(),
    lyricsFile: text(),
    duration: int().notNull(),
    isPrivate: boolean().default(false),
    releaseDate: date({ mode: 'string' }).$defaultFn(() => new Date().toISOString().split('T')[0]!),
    distributor: varchar({ length: 255 }),
    stream: varchar({ length: 255 }),
    isIndie: boolean().default(false),
    mvlink: varchar({ length: 500 }),
    hasLyrics: boolean().default(false),
    userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "restrict" }),
    likes: int().default(0),
    listens: int().default(0),
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

// song_genres table
export const songGenres = mysqlTable("song_genres", {
    id: int().primaryKey().notNull().autoincrement(),
    genreId: varchar({ length: 36 }).notNull().references(() => genres.id, { onDelete: "cascade" }),
    songId: varchar({ length: 36 }).notNull().references(() => songs.id, { onDelete: "cascade" }),
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