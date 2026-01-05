import Facebook from "./providers/facebook"
import Google from "./providers/google"
import { env } from "@yukikaze/lib/create-env"
import { AuthOptions } from "./types"

export const authOptions = {
    providers: {
        facebook: new Facebook({
            clientId: env.FACEBOOK_CLIENT_ID!,
            clientSecret: env.FACEBOOK_CLIENT_SECRET!,
        }),
        google: new Google({
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!,
        }),
    },
} as const

export type Provider = keyof typeof authOptions.providers

export const DEFAULT_OPTIONS = {
    cookieKeys: {
        token: 'auth.token',
        state: 'auth.state',
        code: 'auth.code',
        redirect: 'auth.redirect',
    },
    cookieOptions: {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        // secure: env.NODE_ENV === "production", // Required for HTTPS
        // sameSite: env.NODE_ENV === "production" ? 'lax' : 'strict', // Required for cross-domain cookies
        path: '/',
    },
} as const satisfies Omit<Required<AuthOptions>, 'providers'>