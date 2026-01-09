import * as z from 'zod'

export namespace GenreValidators {
    export const createGenreInput = z.object({
        name: z
            .string('Name cannot be empty')
            .min(3, 'Name must be between 3 and 50 characters')
            .max(50, 'Name must be between 3 and 50 characters'),
        description: z.string().optional(),
        subGenreId: z.string().optional(),
    })
    export type CreateGenreInput = z.infer<typeof createGenreInput>

    export const updateGenreInput = createGenreInput.partial().extend({
        id: z.string('Genre ID is required'),
    })
    export type UpdateGenreInput = z.infer<typeof updateGenreInput>

    export const deleteGenreInput = z.object({
        id: z.string('Genre ID is required'),
    })
    export type DeleteGenreInput = z.infer<typeof deleteGenreInput>
}