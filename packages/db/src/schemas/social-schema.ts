import { relations } from "drizzle-orm"
import {
    type AnyMySqlColumn,
    index,
    int,
    mysqlTable,
    varchar
} from "drizzle-orm/mysql-core"
import { createId } from "@yukikaze/lib/create-cuid"
import { createdAt, updatedAt } from "../utils"
import { songs, users } from "."

export const comments = mysqlTable("comments", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    content: varchar({ length: 255 }).notNull(),
    parentCommentId: varchar({ length: 36 }).references(
        (): AnyMySqlColumn => comments.id,
        { onDelete: "set null" },
    ),
    songId: varchar({ length: 36 }).notNull().references(() => songs.id, { onDelete: "cascade" }),
    likes: int().default(0),
    createdAt,
    updatedAt,
}, (t) => [
    index("comments_user_id_idx").on(t.userId),
    index("comments_song_id_idx").on(t.songId),
    index("comments_parent_comment_id_idx").on(t.parentCommentId),
])

export const commentsRelations = relations(comments, ({ many, one }) => ({
    user: one(users, {
        fields: [comments.userId],
        references: [users.id],
    }),
    song: one(songs, {
        fields: [comments.songId],
        references: [songs.id],
    }),
    parentComment: one(comments, {
        fields: [comments.parentCommentId],
        references: [comments.id],
    }),
    childComments: many(comments),
}))

export const chats = mysqlTable("chats", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    fromUserId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    toUserId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
    content: varchar({ length: 255 }).notNull(),
    createdAt,
    updatedAt,
}, (t) => [
    index("chats_from_user_id_idx").on(t.fromUserId),
    index("chats_to_user_id_idx").on(t.toUserId),
])

export const chatsRelations = relations(chats, ({ one }) => ({
    fromUser: one(users, {
        fields: [chats.fromUserId],
        references: [users.id],
    }),
    toUser: one(users, {
        fields: [chats.toUserId],
        references: [users.id],
    }),
}))
