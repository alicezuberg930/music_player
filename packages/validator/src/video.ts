import * as z from 'zod'

export namespace VideoValidators {
    export const createVideoInput = z.object({
        stream: z.string('Video file is required'),
        title: z
            .string('Title cannot be empty')
            .min(3, 'Title must be between 3 and 50 characters')
            .max(50, 'Title must be between 3 and 50 characters'),
        artistIds: z
            .array(z.string('Each artist id must be a string'))
            .min(1, 'At least one artist id is required'),
    })
    export type CreateVideoInput = z.infer<typeof createVideoInput>

    // export const updateSongInput = createVideoInput.partial()

    // export type UpdateSongInput = z.infer<typeof updateSongInput>

    // export const querySongParams = z.object({
    //     search: z.string().optional(),
    //     page: z.string().optional(),
    //     limit: z.string().optional(),
    //     sortBy: z.string().optional(),
    //     sortOrder: z.enum(['asc', 'desc']).optional(),
    // })
    // export type QuerySongParams = z.infer<typeof querySongParams>
}