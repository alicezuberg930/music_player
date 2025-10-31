import { usersTable } from "../../db/schemas";

export type User = typeof usersTable.$inferInsert | typeof usersTable.$inferSelect
