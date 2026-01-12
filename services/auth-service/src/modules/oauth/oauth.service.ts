import { authOptions, Provider, DEFAULT_OPTIONS } from '../../lib/helpers/auth'
import { and, db, eq } from '@yukikaze/db'
import { users } from '@yukikaze/db/schemas'
import sendEmail from '@yukikaze/email'
import { createId } from '@yukikaze/lib/create-cuid'
import { env } from '@yukikaze/lib/create-env'
import { generateStateOrCode } from '@yukikaze/lib/crypto'
import { BadRequestException } from '@yukikaze/lib/exception'
import { JWT } from '@yukikaze/lib/jwt'
import { Password } from '@yukikaze/lib/password'
import { Request, Response } from 'express'

export class OAuthService {
    private cookieOptions = DEFAULT_OPTIONS.cookieOptions;
    private cookieKeys = DEFAULT_OPTIONS.cookieKeys;

    public async handleProvider(request: Request<{ provider: string }>, response: Response) {
        const { provider } = request.params
        const instance = authOptions.providers[provider as Provider]
        if (!instance) throw new BadRequestException(`Provider ${provider} not found`)
        const state = generateStateOrCode()
        const codeVerifier = generateStateOrCode()
        const callbackUrl = await instance.createAuthorizationURL(state, codeVerifier)
        response.cookie(this.cookieKeys.state, state, {
            ...this.cookieOptions,
            sameSite: 'none',
            maxAge: 5 * 60 * 1000
        })
        response.cookie(this.cookieKeys.code, codeVerifier, {
            ...this.cookieOptions,
            sameSite: 'none',
            maxAge: 5 * 60 * 1000
        })
        response.redirect(callbackUrl.toString())
    }

    public async handleCallback(request: Request<{ provider: string }>, response: Response) {
        const { provider } = request.params
        const instance = authOptions.providers[provider as Provider]
        if (!instance) throw new BadRequestException(`Provider ${provider} not found`)
        const storedState = request.cookies[this.cookieKeys.state]
        const codeVerifier = request.cookies[this.cookieKeys.code]
        if (!storedState || !codeVerifier) {
            throw new BadRequestException('Missing cookies for OAuth flow')
        }
        const returnedState = request.query['state']
        const code = request.query['code'] as string | undefined
        if (storedState !== returnedState) {
            throw new BadRequestException('Invaldid state parameter')
        }
        const tokenSet = await instance.getAccessToken(code!, codeVerifier)
        const userData = await instance.fetchUser(tokenSet)
        let userId: string | undefined = undefined
        const user = await db.query.users.findFirst({ where: and(eq(users.email, "tien23851@gmail.com"), eq(users.provider, provider as Provider)) })
        console.log(user)
        userId = user?.id
        if (!user) {
            const verifyToken = await new Password().hash(createId())
            const verifyTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour from now

            const newUser = await db.insert(users).values({
                fullname: userData.name,
                email: userData.email,
                avatar: userData.avatar,
                provider: provider as Provider,
                verifyToken,
                verifyTokenExpires
            }).$returningId()
            userId = newUser[0]?.id
            const verifyLink = `${env.NODE_ENV === "production" ? 'https://tien-music-player.site' : 'http://localhost:5173'}/verify/${userId}?token=${verifyToken}`
            sendEmail({
                to: userData.email,
                subject: 'Verify Your Email - Yukikaze Music Player',
                template: 'VerifyEmail',
                data: { username: userData.name, verifyLink }
            })
                .then(_ => console.log('Verification email sent successfully'))
                .catch(err => console.error('Failed to send verification email:', err))
        }
        const token = await new JWT(env.ACCESS_TOKEN_SECRET).sign({ id: userId }, { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN })
        // Clear OAuth flow cookies
        response.clearCookie(this.cookieKeys.state, { ...this.cookieOptions, sameSite: 'none' })
        response.clearCookie(this.cookieKeys.code, { ...this.cookieOptions, sameSite: 'none' })
        // Set access token cookie with proper settings for redirect
        response.cookie('accessToken', token, {
            ...this.cookieOptions,
            maxAge: env.ACCESS_TOKEN_EXPIRES_IN * 1000
        })
        // Redirect to frontend
        const frontendUrl = new URL(env.NODE_ENV === 'production' ? 'https://tien-music-player.site' : 'http://localhost:5173')
        response.redirect(frontendUrl.toString())
    }
}