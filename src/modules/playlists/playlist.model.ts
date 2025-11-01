import { playlists } from "../../db/schemas";

export type PlayList = typeof playlists.$inferInsert | typeof playlists.$inferSelect
