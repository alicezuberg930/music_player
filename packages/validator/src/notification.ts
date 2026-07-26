import * as z from "zod"

export const queryNotificationParams = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
})

export type QuerySongParams = z.infer<typeof queryNotificationParams>