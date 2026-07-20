import * as z from 'zod'

export namespace VideoValidators {
    export const createVideoInput = z.object({
        // stream: z.string('Video file is required'),
        title: z
            .string('Title cannot be empty')
            .min(3, 'Title must be between 3 and 50 characters')
            .max(50, 'Title must be between 3 and 50 characters'),
        artistIds: z
            .array(z.string('Each artist id must be a string'))
            .min(1, 'At least one artist id is required'),
    })
    export type CreateVideoInput = z.infer<typeof createVideoInput>

    export const updateVideoInput = createVideoInput.partial()

    export type UpdateVideoInput = z.infer<typeof updateVideoInput>

    export const queryVideoParams = z.object({
        search: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    })
    export type QueryVideoParams = z.infer<typeof queryVideoParams>
}