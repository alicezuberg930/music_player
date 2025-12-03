"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playlistSongsRelations = exports.playlistSongs = exports.playlistArtistsRelations = exports.playlistArtists = exports.playlistsRelations = exports.playlists = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const utils_1 = require("../utils");
const drizzle_orm_1 = require("drizzle-orm");
const _1 = require("./");
// playlist table
exports.playlists = (0, mysql_core_1.mysqlTable)("playlists", {
    id: (0, mysql_core_1.varchar)({ length: 36 }).primaryKey().notNull().$defaultFn(() => (0, utils_1.createId)()),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    artistNames: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    isWorldWide: (0, mysql_core_1.boolean)().default(false),
    thumbnail: (0, mysql_core_1.text)().notNull(),
    isPrivate: (0, mysql_core_1.boolean)().default(false),
    releaseDate: (0, mysql_core_1.date)({ mode: 'string' }),
    description: (0, mysql_core_1.text)(),
    isIndie: (0, mysql_core_1.boolean)().default(false),
    userId: (0, mysql_core_1.varchar)({ length: 36 }).notNull().references(() => _1.users.id, { onDelete: "restrict" }),
    totalDuration: (0, mysql_core_1.int)().default(0),
    likes: (0, mysql_core_1.int)().default(0),
    listens: (0, mysql_core_1.int)().default(0),
    liked: (0, mysql_core_1.boolean)().default(false),
    comments: (0, mysql_core_1.int)().default(0),
    isAlbum: (0, mysql_core_1.boolean)().default(false),
    createdAt: utils_1.createdAt,
    updatedAt: utils_1.updatedAt
}, (t) => [
    (0, mysql_core_1.index)('playlists_user_id_idx').on(t.userId),
    (0, mysql_core_1.index)('playlists_title_idx').on(t.title)
]);
// playlist relationship with user and artist
exports.playlistsRelations = (0, drizzle_orm_1.relations)(exports.playlists, ({ one, many }) => ({
    user: one(_1.users, {
        fields: [exports.playlists.userId],
        references: [_1.users.id],
    }),
    artists: many(exports.playlistArtists),
    songs: many(exports.playlistSongs)
}));
// playlist_artist table
exports.playlistArtists = (0, mysql_core_1.mysqlTable)("playlist_artists", {
    id: (0, mysql_core_1.int)().primaryKey().notNull().autoincrement(),
    playlistId: (0, mysql_core_1.varchar)({ length: 36 }).notNull().references(() => exports.playlists.id, { onDelete: "cascade" }),
    artistId: (0, mysql_core_1.varchar)({ length: 36 }).notNull().references(() => _1.artists.id, { onDelete: "restrict" }),
}, (t) => [
    (0, mysql_core_1.index)('playlist_id_idx').on(t.playlistId),
    (0, mysql_core_1.index)('artist_id_idx').on(t.artistId)
]);
// playlist_artist relationship with playlist and artist
exports.playlistArtistsRelations = (0, drizzle_orm_1.relations)(exports.playlistArtists, ({ one }) => ({
    playlist: one(exports.playlists, {
        fields: [exports.playlistArtists.playlistId],
        references: [exports.playlists.id],
    }),
    artist: one(_1.artists, {
        fields: [exports.playlistArtists.artistId],
        references: [_1.artists.id],
    })
}));
// playlist_songs table
exports.playlistSongs = (0, mysql_core_1.mysqlTable)("playlist_songs", {
    id: (0, mysql_core_1.int)().primaryKey().notNull().autoincrement(),
    playlistId: (0, mysql_core_1.varchar)({ length: 36 }).notNull().references(() => exports.playlists.id, { onDelete: "cascade" }),
    songId: (0, mysql_core_1.varchar)({ length: 36 }).notNull().references(() => _1.songs.id, { onDelete: "cascade" }),
}, (t) => [
    (0, mysql_core_1.index)('playlist_id_idx').on(t.playlistId),
    (0, mysql_core_1.index)('song_id_idx').on(t.songId)
]);
// playlist_songs relationship with playlist and song
exports.playlistSongsRelations = (0, drizzle_orm_1.relations)(exports.playlistSongs, ({ one }) => ({
    playlist: one(exports.playlists, {
        fields: [exports.playlistSongs.playlistId],
        references: [exports.playlists.id],
    }),
    song: one(_1.songs, {
        fields: [exports.playlistSongs.songId],
        references: [_1.songs.id],
    })
}));
