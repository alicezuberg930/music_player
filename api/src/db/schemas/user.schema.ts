import { createdAt, createId, updatedAt } from "../utils"
import { mysqlTable, varchar, date, boolean, timestamp } from "drizzle-orm/mysql-core"
import { relations } from "drizzle-orm"
import { songs, playlists } from "./"

export const users = mysqlTable("users", {
    id: varchar({ length: 36 }).primaryKey().notNull().$defaultFn(() => createId()),
    fullname: varchar({ length: 100 }).notNull(),
    phone: varchar({ length: 20 }).unique(),
    avatar: varchar({ length: 255 }),
    birthday: date({ mode: 'string' }),
    email: varchar({ length: 100 }).notNull().unique(),
    password: varchar({ length: 255 }),
    isVerified: boolean().notNull().default(false),
    verifyToken: varchar({ length: 255 }),
    verifyTokenExpires: timestamp({ mode: 'date' }),
    resetPasswordToken: varchar({ length: 255 }),
    resetPasswordExpires: timestamp({ mode: 'date' }),
    createdAt,
    updatedAt,
})

export const usersRelations = relations(users, ({ many }) => ({
    songs: many(songs),
    playlists: many(playlists)
}))
