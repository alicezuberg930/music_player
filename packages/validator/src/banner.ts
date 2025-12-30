import * as z from 'zod'

export namespace BannerValidators {
    export const createBannerInput = z.object({
        name: z.string('Name cannot be empty'),
    })
    export type CreateBannerInput = z.infer<typeof createBannerInput>

    export const updateBannerInput = createBannerInput.partial()
    export type UpdateBannerInput = z.infer<typeof updateBannerInput>
}