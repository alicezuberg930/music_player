"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.songGenresRelations = exports.songGenres = exports.songsRelations = exports.songs = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const utils_1 = require("../utils");
const drizzle_orm_1 = require("drizzle-orm");
const _1 = require("./");
exports.songs = (0, mysql_core_1.mysqlTable)("songs", {
    id: (0, mysql_core_1.varchar)({ length: 36 }).primaryKey().notNull().$defaultFn(() => (0, utils_1.createId)()),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    alias: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    artistNames: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    isWorldWide: (0, mysql_core_1.boolean)().default(false),
    thumbnail: (0, mysql_core_1.text)().notNull(),
    lyricsFile: (0, mysql_core_1.text)(),
    duration: (0, mysql_core_1.int)().notNull(),
    isPrivate: (0, mysql_core_1.boolean)().default(false),
    releaseDate: (0, mysql_core_1.date)({ mode: 'string' }).default(new Date().toISOString().split('T')[0]),
    distributor: (0, mysql_core_1.varchar)({ length: 255 }),
    stream: (0, mysql_core_1.varchar)({ length: 255 }),
    isIndie: (0, mysql_core_1.boolean)().default(false),
    mvlink: (0, mysql_core_1.varchar)({ length: 500 }),
    hasLyrics: (0, mysql_core_1.boolean)().default(false),
    userId: (0, mysql_core_1.varchar)({ length: 36 }).notNull().references(() => _1.users.id, { onDelete: "restrict" }),
    likes: (0, mysql_core_1.int)().default(0),
    listens: (0, mysql_core_1.int)().default(0),
    liked: (0, mysql_core_1.boolean)().default(false),
    comments: (0, mysql_core_1.int)().default(0),
    size: (0, mysql_core_1.int)().notNull(),
    createdAt: utils_1.createdAt,
    updatedAt: utils_1.updatedAt
}, (t) => [
    (0, mysql_core_1.index)('songs_user_id_idx').on(t.userId),
    (0, mysql_core_1.index)('songs_title_idx').on(t.title)
]);
exports.songsRelations = (0, drizzle_orm_1.relations)(exports.songs, ({ one, many }) => ({
    user: one(_1.users, {
        fields: [exports.songs.userId],
        references: [_1.users.id],
    }),
    artists: many(_1.artistsSongs),
    genres: many(exports.songGenres)
}));
// song_genres table
exports.songGenres = (0, mysql_core_1.mysqlTable)("song_genres", {
    id: (0, mysql_core_1.int)().primaryKey().notNull().autoincrement(),
    genreId: (0, mysql_core_1.varchar)({ length: 36 }).notNull().references(() => _1.genres.id, { onDelete: "cascade" }),
    songId: (0, mysql_core_1.varchar)({ length: 36 }).notNull().references(() => exports.songs.id, { onDelete: "cascade" }),
}, (t) => [
    (0, mysql_core_1.index)('genre_id_idx').on(t.genreId),
    (0, mysql_core_1.index)('song_id_idx').on(t.songId)
]);
exports.songGenresRelations = (0, drizzle_orm_1.relations)(exports.songGenres, ({ one }) => ({
    genre: one(_1.genres, {
        fields: [exports.songGenres.genreId],
        references: [_1.genres.id],
    }),
    song: one(exports.songs, {
        fields: [exports.songGenres.songId],
        references: [exports.songs.id],
    }),
}));
