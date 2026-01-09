import { index, mysqlTable, int, varchar, boolean, text, date } from "drizzle-orm/mysql-core"
import { createdAt, updatedAt } from "../utils"
import { createId } from "@yukikaze/lib/create-cuid"
import { relations } from "drizzle-orm"
import { users } from "./"

// session table
export const sessions = mysqlTable("sessions", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    refreshToken: varchar({ length: 255 }).notNull(),
    userAgent: varchar({ length: 512 }),
    ipAddress: varchar({ length: 45 }),
    isValid: boolean().default(true),
    createdAt,
    updatedAt
}, (t) => [
    index('sessions_user_id_idx').on(t.userId),
    index('sessions_refresh_token_idx').on(t.refreshToken)
])

// session relationship with user
export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    })
}))