import { mysqlTable, varchar, text, mysqlEnum } from "drizzle-orm/mysql-core"
import { createdAt, updatedAt } from "../utils"
import { createId } from "@yukikaze/lib/create-cuid"

export const logs = mysqlTable("logs", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    message: text(),
    environment: mysqlEnum(['production', 'development']).notNull(),
    level: mysqlEnum(['info', 'warning', 'error']).notNull(),
    ipAddress: varchar({ length: 45 }),
    createdAt,
    updatedAt,
})