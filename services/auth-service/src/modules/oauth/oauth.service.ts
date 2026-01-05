import { authOptions, Provider, DEFAULT_OPTIONS } from '@/lib/helpers/auth'
import { and, db, eq } from '@yukikaze/db'
import { users } from '@yukikaze/db/schemas'
import { env } from '@yukikaze/lib/create-env'
import { generateStateOrCode } from '@yukikaze/lib/crypto'
import { BadRequestException } from '@yukikaze/lib/exception'
import { JWT } from '@yukikaze/lib/jwt'
import { Request, Response } from 'express'

export class OAuthService {
    public async handleProvider(request: Request<{ provider: string }>, response: Response) {
        const { provider } = request.params
        const instance = authOptions.providers[provider as Provider]
        if (!instance) throw new BadRequestException(`Provider ${provider} not found`)
        const { cookieKeys, cookieOptions } = DEFAULT_OPTIONS
        const state = generateStateOrCode()
        const codeVerifier = generateStateOrCode()
        const callbackUrl = await instance.createAuthorizationURL(state, codeVerifier)
        response.cookie(cookieKeys.state, state, { ...cookieOptions, maxAge: 5 * 60 * 1000 })
        response.cookie(cookieKeys.code, codeVerifier, { ...cookieOptions, maxAge: 5 * 60 * 1000 })
        response.redirect(callbackUrl.toString())
    }

    public async handleCallback(request: Request<{ provider: string }>, response: Response) {
        const { provider } = request.params
        const instance = authOptions.providers[provider as Provider]
        if (!instance) throw new BadRequestException(`Provider ${provider} not found`)
        const { cookieKeys, cookieOptions } = DEFAULT_OPTIONS
        console.log(request.cookies)
        const storedState = request.cookies[cookieKeys.state]
        const codeVerifier = request.cookies[cookieKeys.code]
        if (!storedState || !codeVerifier) {
            throw new BadRequestException('Missing cookies for OAuth flow')
        }
        const returnedState = request.query['state']
        const code = request.query['code'] as string | undefined
        if (storedState !== returnedState) {
            throw new BadRequestException('Invalid state parameter')
        }
        const tokenSet = await instance.getAccessToken(code!, codeVerifier)
        const userData = await instance.fetchUser(tokenSet)
        let userId: string | undefined = undefined
        const user = await db.query.users.findFirst({ where: and(eq(users.email, userData.email), eq(users.provider, provider as Provider)) })
        userId = user?.id
        if (!user) {
            const newUser = await db.insert(users).values({
                fullname: userData.name,
                email: userData.email,
                avatar: userData.avatar,
                provider: provider as Provider,
            }).$returningId()
            userId = newUser[0]?.id
        }
        const token = await new JWT(env.JWT_SECRET).sign({ id: userId }, { expiresIn: env.JWT_EXPIRES_IN })
        // Clear OAuth flow cookies
        response.clearCookie(cookieKeys.state, cookieOptions)
        response.clearCookie(cookieKeys.code, cookieOptions)
        response.clearCookie(cookieKeys.redirect, cookieOptions)

        // Set access token cookie with proper settings for redirect
        response.cookie('accessToken', token, {
            httpOnly: true,
            secure: true, // Required for SameSite=None
            sameSite: env.NODE_ENV === 'production' ? 'lax' : 'strict', // Required for cross-domain cookies
            domain: env.NODE_ENV === 'production' ? '.tien-music-player.site' : undefined, // Share cookie across subdomains
            maxAge: env.JWT_EXPIRES_IN * 1000 // 1 day
        })
        // Redirect to frontend
        const frontendUrl = new URL(env.NODE_ENV === 'production' ? 'https://tien-music-player.site' : 'http://localhost:5173')
        response.redirect(frontendUrl.toString())
    }
}