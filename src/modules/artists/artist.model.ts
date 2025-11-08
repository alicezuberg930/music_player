import { artists } from "../../db/schemas"

export type Artist = typeof artists.$inferSelect
