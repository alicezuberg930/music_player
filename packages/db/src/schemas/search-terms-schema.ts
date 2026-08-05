import { index, mysqlTable, int, varchar, text } from "drizzle-orm/mysql-core"
import { createdAt, updatedAt } from "../utils"
import { createId } from "@yukikaze/lib/create-cuid"
import { users } from "."

export const searchTerms = mysqlTable("search_terms", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    userId: varchar({ length: 36 }).references(() => users.id, { onDelete: "cascade" }),
    content: text().notNull(),
    // for increasing count if its content is the same
    count: int(),
    createdAt,
    updatedAt
}, (t) => [
    index('sessions_user_id_idx').on(t.userId),
])