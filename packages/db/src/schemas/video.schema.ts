import { index, mysqlTable, int, varchar, boolean, text, date } from "drizzle-orm/mysql-core"
import { createdAt, updatedAt } from "../utils"
import { createId } from "@yukikaze/lib/create-cuid"
import { relations } from "drizzle-orm"
import { artistsVideos, users } from "./"

export const videos = mysqlTable("videos", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    title: varchar({ length: 255 }).notNull(),
    alias: varchar({ length: 255 }).notNull(),
    artistNames: varchar({ length: 255 }).notNull(),
    isWorldWide: boolean().default(false),
    thumbnail: text().notNull(),
    duration: int().notNull(),
    isPrivate: boolean().default(false),
    releaseDate: date({ mode: 'string' }).$defaultFn(() => new Date().toISOString().split('T')[0]!),
    distributor: varchar({ length: 255 }),
    stream: varchar({ length: 255 }),
    isIndie: boolean().default(false),
    userId: varchar({ length: 36 }).notNull().references(() => users.id, { onDelete: "restrict" }),
    likes: int().default(0),
    views: int().default(0),
    comments: int().default(0),
    size: int().notNull(),
    createdAt,
    updatedAt
}, (t) => [
    index('videos_user_id_idx').on(t.userId),
    index('videos_title_idx').on(t.title),
    index('videos_artist_names_idx').on(t.artistNames)
])

export const videosRelations = relations(videos, ({ one, many }) => ({
    user: one(users, {
        fields: [videos.userId],
        references: [users.id],
    }),
    artists: many(artistsVideos),
}))