import { varchar, mysqlTable } from "drizzle-orm/mysql-core"
import { createdAt, updatedAt } from "../utils"
import { createId } from "@yukikaze/lib/create-cuid"

// banners table
export const banners = mysqlTable("banners", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    name: varchar({ length: 255 }),
    thumbnail: varchar({ length: 255 }).notNull(),
    createdAt,
    updatedAt,
})