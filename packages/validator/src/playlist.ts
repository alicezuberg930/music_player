import * as z from 'zod'

export namespace PlaylistValidators {
    export const createPlaylistInput = z.object({
        title: z
            .string('Title cannot be empty')
            .min(3, 'Title must be between 3 and 50 characters')
            .max(50, 'Title must be between 3 and 50 characters'),
        description: z.string().optional(),
        isPrivate: z.boolean('Privacy setting is required'),
        releaseDate: z.string().optional(),
    })
    export type CreatePlaylistInput = z.infer<typeof createPlaylistInput>

    export const updatePlaylistInput = createPlaylistInput.partial().extend({
        songIds: z
            .array(z.string('Each song id must be a string'))
            .min(1, 'At least one song id is required')
            .optional(),
    })
    export type UpdatePlaylistInput = z.infer<typeof updatePlaylistInput>

    export const queryPlaylistParams = z.object({
        search: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
        artistName: z.string().optional(),
    })
    export type QueryPlaylistParams = z.infer<typeof queryPlaylistParams>

    export const addSongsInput = z.object({
        songIds: z
            .array(z.string('Each song id must be a string'))
            .min(1, 'At least one song id is required'),
    })
    export type AddSongsInput = z.infer<typeof addSongsInput>

    export const removeSongsInput = addSongsInput
    export type RemoveSongsInput = z.infer<typeof removeSongsInput>
}