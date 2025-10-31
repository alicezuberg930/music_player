import { mysqlTable, int, varchar, boolean, text, date } from "drizzle-orm/mysql-core";
import { users } from "./user.schema";
import { createdAt, updatedAt } from "../utils";
import { relations } from "drizzle-orm";

export const songs = mysqlTable("songs", {
    id: int().primaryKey().autoincrement(),
    title: varchar({ length: 255 }).notNull(),
    alias: varchar({ length: 255 }).notNull(),
    artistNames: varchar({ length: 255 }).notNull(),
    isWorldWide: boolean().default(false),
    thumbnail: text().notNull(),
    duration: int().notNull(),
    isPrivate: boolean().default(false),
    releaseDate: date({ mode: 'string' }),
    distributor: varchar({ length: 255 }),
    isIndie: boolean().default(false),
    mvlink: varchar({ length: 500 }),
    hasLyrics: boolean().default(false),
    userId: int().references(() => users.id, { onDelete: "set null" }),
    likes: int().default(0),
    listens: int().default(0),
    liked: boolean().default(false),
    comments: int().default(0),
    createdAt,
    updatedAt
});

export const songsRelations = relations(songs, ({ one }) => ({
    user: one(users, {
        fields: [songs.userId],
        references: [users.id],
    }),
}))