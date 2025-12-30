import * as z from 'zod'

export namespace SongValidators {
    export const createSongInput = z.object({
        releaseDate: z.string('Release date cannot be empty'),
        title: z
            .string('Title cannot be empty')
            .min(3, 'Title must be between 3 and 50 characters')
            .max(50, 'Title must be between 3 and 50 characters'),
        artistIds: z
            .array(z.string('Each artist id must be a string'))
            .min(1, 'At least one artist id is required'),
    })
    export type CreateSongInput = z.infer<typeof createSongInput>

    export const updateSongInput = createSongInput.partial()

    export type UpdateSongInput = z.infer<typeof updateSongInput>

    export const querySongParams = z.object({
        search: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
    })
    export type QuerySongParams = z.infer<typeof querySongParams>
}