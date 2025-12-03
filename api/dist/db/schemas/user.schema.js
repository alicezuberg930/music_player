"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRelations = exports.users = void 0;
const utils_1 = require("../utils");
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
const _1 = require("./");
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
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    songs: many(_1.songs),
    playlists: many(_1.playlists)
}));
