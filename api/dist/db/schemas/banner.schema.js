"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.banners = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const utils_1 = require("../utils");
// banners table
exports.banners = (0, mysql_core_1.mysqlTable)("banners", {
    id: (0, mysql_core_1.varchar)({ length: 36 }).primaryKey().notNull().$defaultFn(() => (0, utils_1.createId)()),
    name: (0, mysql_core_1.varchar)({ length: 255 }),
    thumbnail: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    createdAt: utils_1.createdAt,
    updatedAt: utils_1.updatedAt,
});
