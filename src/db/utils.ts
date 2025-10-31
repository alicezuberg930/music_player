import { timestamp } from "drizzle-orm/mysql-core"

export const createdAt = timestamp({ mode: 'date' })
    .defaultNow()
    .notNull()

export const updatedAt = timestamp({ mode: 'date' })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull()