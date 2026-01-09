import { genres } from "@yukikaze/db/schemas"

export type Genre = typeof genres.$inferSelect
// export type GenreWithSubGenres = Genre & { subGenres: GenreWithSubGenres[] }