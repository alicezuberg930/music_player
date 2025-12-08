"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFavoritePlaylistsRelations = exports.userFavoritePlaylists = exports.userFavoriteSongsRelations = exports.userFavoriteSongs = exports.usersRelations = exports.users = void 0;
const utils_1 = require("../utils");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
const _1 = require("./");
// users table
exports.users = (0, mysql_core_1.mysqlTable)("users", {
    id: (0, mysql_core_1.varchar)({ length: 36 }).primaryKey().notNull().$defaultFn(() => (0, utils_1.createId)()),
    fullname: (0, mysql_core_1.varchar)({ length: 100 }).notNull(),
    phone: (0, mysql_core_1.varchar)({ length: 20 }).unique(),
    avatar: (0, mysql_core_1.varchar)({ length: 255 }),
    birthday: (0, mysql_core_1.date)({ mode: 'string' }),
    email: (0, mysql_core_1.varchar)({ length: 100 }).notNull().unique(),
    password: (0, mysql_core_1.varchar)({ length: 255 }),
    isVerified: (0, mysql_core_1.boolean)().notNull().default(false),
    verifyToken: (0, mysql_core_1.varchar)({ length: 255 }),
    verifyTokenExpires: (0, mysql_core_1.timestamp)({ mode: 'date' }),
    resetPasswordToken: (0, mysql_core_1.varchar)({ length: 255 }),
    resetPasswordExpires: (0, mysql_core_1.timestamp)({ mode: 'date' }),
    createdAt: utils_1.createdAt,
    updatedAt: utils_1.updatedAt,
});
// user's relationships (songs, playlists, favorite songs/playlists)
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    songs: many(_1.songs),
    playlists: many(_1.playlists),
    favoriteSongs: many(exports.userFavoriteSongs),
    favoritePlaylists: many(exports.userFavoritePlaylists),
}));
// user_favorite_songs table
exports.userFavoriteSongs = (0, mysql_core_1.mysqlTable)("user_favorite_songs", {
    userId: (0, mysql_core_1.varchar)({ length: 36 }).notNull().references(() => exports.users.id, { onDelete: "cascade" }),
    songId: (0, mysql_core_1.varchar)({ length: 36 }).notNull().references(() => _1.songs.id, { onDelete: "cascade" }),
}, (t) => [
    (0, mysql_core_1.primaryKey)({ columns: [t.userId, t.songId] }),
    (0, mysql_core_1.index)('user_id_idx').on(t.userId),
    (0, mysql_core_1.index)('song_id_idx').on(t.songId)
]);
// user_favorite_songs relationships 
exports.userFavoriteSongsRelations = (0, drizzle_orm_1.relations)(exports.userFavoriteSongs, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.userFavoriteSongs.userId],
        references: [exports.users.id],
    }),
    song: one(_1.songs, {
        fields: [exports.userFavoriteSongs.songId],
        references: [_1.songs.id],
    }),
}));
// user_favorite_playlists table
exports.userFavoritePlaylists = (0, mysql_core_1.mysqlTable)('user_favorite_playlists', {
    userId: (0, mysql_core_1.varchar)({ length: 36 }).notNull().references(() => exports.users.id, { onDelete: "cascade" }),
    playlistId: (0, mysql_core_1.varchar)({ length: 36 }).notNull().references(() => _1.playlists.id, { onDelete: "cascade" }),
}, (t) => [
    (0, mysql_core_1.primaryKey)({ columns: [t.userId, t.playlistId] }),
    (0, mysql_core_1.index)('user_id_idx').on(t.userId),
    (0, mysql_core_1.index)('playlist_id_idx').on(t.playlistId)
]);
// user_favorite_playlists relationships
exports.userFavoritePlaylistsRelations = (0, drizzle_orm_1.relations)(exports.userFavoritePlaylists, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.userFavoritePlaylists.userId],
        references: [exports.users.id],
    }),
    playlist: one(_1.playlists, {
        fields: [exports.userFavoritePlaylists.playlistId],
        references: [_1.playlists.id],
    }),
}));
