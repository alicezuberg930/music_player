import { varchar, mysqlTable } from "drizzle-orm/mysql-core"
import { createdAt, createId, updatedAt } from "../utils"
import { relations } from "drizzle-orm"
import { songGenres } from "./song.schema"

// genres table
export const genres = mysqlTable("genres", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    name: varchar({ length: 255 }).notNull(),
    alias: varchar({ length: 255 }),
    createdAt,
    updatedAt,
})

export const genresRelations = relations(genres, ({ many }) => ({
    songs: many(songGenres)
}))