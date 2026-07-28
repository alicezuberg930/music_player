import { relations } from "drizzle-orm"
import { boolean, index, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core"
import { createId } from "@yukikaze/lib/create-cuid"
import { createdAt, updatedAt } from "../utils"
import { users } from "./"

export const notifications = mysqlTable("notifications", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    title: varchar({ length: 255 }).notNull(),
    content: text().notNull(),
    type: varchar({ length: 50 }).notNull(),
    time: timestamp({ mode: "date" }).defaultNow().notNull(),
    isRead: boolean().notNull().default(false),
    toUserId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    uniqueKey: varchar({ length: 255 }),
    createdAt,
    updatedAt,
}, (t) => [
    index("notifications_to_user_id_idx").on(t.toUserId),
    index("notifications_unique_key_idx").on(t.uniqueKey),
])

export const notificationsRelations = relations(notifications, ({ one }) => ({
    toUser: one(users, {
        fields: [notifications.toUserId],
        references: [users.id],
    }),
}))

export const pushNotifications = mysqlTable("push_notifications", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    endPoint: text().notNull(),
    p256dh: varchar({ length: 255 }).notNull(),
    auth: varchar({ length: 255 }).notNull(),
    ip: varchar({ length: 45 }),
    createdDate: timestamp({ mode: "date" }).defaultNow().notNull(),
    browser: varchar({ length: 255 }),
    device_type: varchar({ length: 255 }),
    device_vendor: varchar({ length: 255 }),
    device_model: varchar({ length: 255 }),
    cpu: varchar({ length: 255 }),
    os: varchar({ length: 255 }),
}, (t) => [
    index("push_notifications_user_id_idx").on(t.userId),
])

export const pushNotificationsRelations = relations(pushNotifications, ({ one }) => ({
    user: one(users, {
        fields: [pushNotifications.userId],
        references: [users.id],
    }),
}))
