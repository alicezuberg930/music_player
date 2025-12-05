"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genresRelations = exports.genres = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const utils_1 = require("../utils");
const drizzle_orm_1 = require("drizzle-orm");
const song_schema_1 = require("./song.schema");
// genres table
exports.genres = (0, mysql_core_1.mysqlTable)("genres", {
    id: (0, mysql_core_1.varchar)({ length: 36 }).primaryKey().notNull().$defaultFn(() => (0, utils_1.createId)()),
    name: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    alias: (0, mysql_core_1.varchar)({ length: 255 }),
    createdAt: utils_1.createdAt,
    updatedAt: utils_1.updatedAt,
});
exports.genresRelations = (0, drizzle_orm_1.relations)(exports.genres, ({ many }) => ({
    songs: many(song_schema_1.songGenres)
}));
