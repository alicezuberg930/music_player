"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistsRelations = exports.artists = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const utils_1 = require("../utils");
const drizzle_orm_1 = require("drizzle-orm");
const _1 = require("./");
exports.artists = (0, mysql_core_1.mysqlTable)("artists", {
    id: (0, mysql_core_1.varchar)({ length: 36 }).primaryKey().notNull().$defaultFn(() => (0, utils_1.createId)()),
    name: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    spotlight: (0, mysql_core_1.boolean)().default(false),
    alias: (0, mysql_core_1.varchar)({ length: 255 }),
    thumbnail: (0, mysql_core_1.text)(),
    totalFollow: (0, mysql_core_1.int)().default(0),
    createdAt: utils_1.createdAt,
    updatedAt: utils_1.updatedAt,
});
exports.artistsRelations = (0, drizzle_orm_1.relations)(exports.artists, ({ one, many }) => ({
    songs: many(_1.artistsSongs),
    playlists: many(_1.playlistArtists),
}));
