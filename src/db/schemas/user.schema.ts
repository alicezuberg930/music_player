import { varchar, int, date } from "drizzle-orm/mysql-core";
import { createdAt, updatedAt } from "../utils";
import { mysqlTable } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: int().autoincrement().primaryKey(),
    fullname: varchar({ length: 100 }).notNull(),
    phone: varchar({ length: 20 }).unique(),
    avatar: varchar({ length: 255 }),
    birthday: date({ mode: 'string' }),
    email: varchar({ length: 100 }).notNull().unique(),
    password: varchar({ length: 255 }),
    createdAt,
    updatedAt,
})