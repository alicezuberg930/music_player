import { users } from "../../db/schemas";

export type User = typeof users.$inferInsert | typeof users.$inferSelect
