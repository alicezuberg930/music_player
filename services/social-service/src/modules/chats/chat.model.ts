import { chats } from "@yukikaze/db/schemas"

export type Chat = typeof chats.$inferSelect
