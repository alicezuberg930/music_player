import * as z from "zod"

export const queryNotificationParams = z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
})

export type QueryNotificationParams = z.infer<typeof queryNotificationParams>

export const readNotificationParams = z.object({
    ids: z.array(z.string()).min(1, { error: 'At least 1 id is required' }).max(100, { error: 'Cannot be more than 100 ids' })
})

export type ReadNotificationParams = z.infer<typeof readNotificationParams>