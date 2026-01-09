import { createdAt, updatedAt } from "../utils"
import { createId } from "@yukikaze/lib/create-cuid"
import { mysqlTable, varchar, date, boolean, timestamp, index, primaryKey, mysqlEnum } from "drizzle-orm/mysql-core"
import { relations } from "drizzle-orm"
import { songs, playlists } from "./"

// users table
export const users = mysqlTable("users", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    fullname: varchar({ length: 100 }).notNull(),
    phone: varchar({ length: 20 }).unique(),
    avatar: varchar({ length: 255 }),
    provider: mysqlEnum(['local', 'facebook', 'google']).default('local').notNull(),
    birthday: date({ mode: 'string' }),
    email: varchar({ length: 100 }).notNull(),
    password: varchar({ length: 255 }),
    isVerified: boolean().notNull().default(false),
    verifyToken: varchar({ length: 255 }),
    verifyTokenExpires: timestamp({ mode: 'date' }),
    resetPasswordToken: varchar({ length: 255 }),
    resetPasswordExpires: timestamp({ mode: 'date' }),
    createdAt,
    updatedAt,
})

// user's relationships (songs, playlists, favorite songs/playlists)
export const usersRelations = relations(users, ({ many }) => ({
    songs: many(songs),
    playlists: many(playlists),
    favoriteSongs: many(userFavoriteSongs),
    favoritePlaylists: many(userFavoritePlaylists),
}))

// user_favorite_songs table
export const userFavoriteSongs = mysqlTable("user_favorite_songs", {
    userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    songId: varchar({ length: 36 }).notNull().references(() => songs.id, { onDelete: "cascade" }),
}, (t) => [
    primaryKey({ columns: [t.userId, t.songId] }),
    index('user_id_idx').on(t.userId),
    index('song_id_idx').on(t.songId)
])

// user_favorite_songs relationships 
export const userFavoriteSongsRelations = relations(userFavoriteSongs, ({ one }) => ({
    user: one(users, {
        fields: [userFavoriteSongs.userId],
        references: [users.id],
    }),
    song: one(songs, {
        fields: [userFavoriteSongs.songId],
        references: [songs.id],
    }),
}))

// user_favorite_playlists table
export const userFavoritePlaylists = mysqlTable('user_favorite_playlists', {
    userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    playlistId: varchar({ length: 36 }).notNull().references(() => playlists.id, { onDelete: "cascade" }),
}, (t) => [
    primaryKey({ columns: [t.userId, t.playlistId] }),
    index('user_id_idx').on(t.userId),
    index('playlist_id_idx').on(t.playlistId)
])

// user_favorite_playlists relationships
export const userFavoritePlaylistsRelations = relations(userFavoritePlaylists, ({ one }) => ({
    user: one(users, {
        fields: [userFavoritePlaylists.userId],
        references: [users.id],
    }),
    playlist: one(playlists, {
        fields: [userFavoritePlaylists.playlistId],
        references: [playlists.id],
    }),
}))