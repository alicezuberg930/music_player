import Facebook from "./providers/facebook"
import Google from "./providers/google"
import type { AuthOptions } from "./types"

export const authOptions = {
    providers: {
        facebook: new Facebook({
            clientId: import.meta.env.FACEBOOK_CLIENT_ID!,
            clientSecret: import.meta.env.FACEBOOK_CLIENT_SECRET!,
        }),
        google: new Google({
            clientId: import.meta.env.GOOGLE_CLIENT_ID!,
            clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET!,
        }),
    },
} satisfies AuthOptions

export type Providers = "credentials" | keyof typeof authOptions.providers

