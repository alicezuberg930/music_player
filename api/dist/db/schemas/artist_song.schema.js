"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistsSongsRelations = exports.artistsSongs = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const _1 = require("./");
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_2 = require("drizzle-orm/mysql-core");
exports.artistsSongs = (0, mysql_core_1.mysqlTable)("artists_songs", {
    id: (0, mysql_core_1.int)().primaryKey().notNull().autoincrement(),
    artistId: (0, mysql_core_2.varchar)({ length: 36 }).notNull().references(() => _1.artists.id, { onDelete: "cascade" }),
    songId: (0, mysql_core_2.varchar)({ length: 36 }).notNull().references(() => _1.songs.id, { onDelete: "cascade" }),
}, (t) => [
    (0, mysql_core_1.index)('artist_id_idx').on(t.artistId),
    (0, mysql_core_1.index)('song_id_idx').on(t.songId),
]);
exports.artistsSongsRelations = (0, drizzle_orm_1.relations)(exports.artistsSongs, ({ one }) => ({
    song: one(_1.songs, {
        fields: [exports.artistsSongs.songId],
        references: [_1.songs.id],
    }),
    artist: one(_1.artists, {
        fields: [exports.artistsSongs.artistId],
        references: [_1.artists.id],
    })
}));
