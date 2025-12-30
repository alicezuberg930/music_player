import * as z from 'zod'

export namespace ArtistValidators {
    export const createArtistInput = z.object({
        name: z
            .string('Name cannot be empty')
            .min(3, 'Name must be between 3 and 50 characters')
            .max(50, 'Name must be between 3 and 50 characters'),
        description: z.string().optional(),
    })
    export type CreateArtistInput = z.infer<typeof createArtistInput>
}