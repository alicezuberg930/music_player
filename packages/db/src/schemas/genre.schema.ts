import { varchar, mysqlTable, type AnyMySqlColumn, foreignKey, text } from "drizzle-orm/mysql-core"
import { createdAt, updatedAt } from "../utils"
import { createId } from "@yukikaze/lib/create-cuid"
import { relations } from "drizzle-orm"
import { songGenres } from "./song.schema"

// genres table
export const genres = mysqlTable("genres", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    name: varchar({ length: 255 }).notNull(),
    alias: varchar({ length: 255 }),
    description: text(),
    subGenreId: varchar({ length: 36 }),
    createdAt,
    updatedAt,
}, (table) => [
    foreignKey({
        columns: [table.subGenreId],
        foreignColumns: [table.id],
        name: "genres_sub_genre_id_fkey",
    })
])

export const genresRelations = relations(genres, ({ many, one }) => ({
    songs: many(songGenres),
    parentGenre: one(genres, {
        fields: [genres.subGenreId],
        references: [genres.id],
        relationName: "genreHierarchy"
    }),
    subGenres: many(genres, {
        relationName: "genreHierarchy"
    }),
}))