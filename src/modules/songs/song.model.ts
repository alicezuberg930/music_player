import { songs } from "../../db/schemas";

export type Song = typeof songs.$inferInsert | typeof songs.$inferSelect
