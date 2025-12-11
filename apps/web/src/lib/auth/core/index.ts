import { generateStateOrCode } from '@/lib/crypto'
import type { AuthOptions } from '../types'
import Cookies from './cookies'
import { isValidToken, jwtDecode } from '../utils'

function setCorsHeaders(response: Response): Response {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Request-Method', '*')
    response.headers.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
    response.headers.set('Access-Control-Allow-Headers', '*')
    return response
}

const DEFAULT_OPTIONS = {
    cookieKeys: {
        token: 'auth.token',
        state: 'auth.state',
        code: 'auth.code',
        redirect: 'auth.redirect',
    },
    cookieOptions: {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
    },
} as const satisfies Omit<Required<AuthOptions>, 'providers'>

export function Auth(opts: AuthOptions) {
    const options = {
        ...DEFAULT_OPTIONS,
        ...opts,
        cookieKeys: { ...DEFAULT_OPTIONS.cookieKeys, ...opts.cookieKeys },
        cookieOptions: { ...DEFAULT_OPTIONS.cookieOptions, ...opts.cookieOptions },
    } satisfies Required<AuthOptions>

    const { cookieKeys, cookieOptions, providers } = options

    return {
        handlers: {
            GET: async (request: Request) => {
                const { pathname, searchParams } = new URL(request.url)
                const cookies = new Cookies(request)

                try {
                    if (pathname === '/api/auth/token') {
                        const token = cookies.get(cookieKeys.token)
                        return setCorsHeaders(Response.json({ token }))
                    }

                    /**
                     * [GET] /api/auth/get-profile: Get user profile
                     */
                    if (pathname === '/api/auth/profile') {
                        const token = cookies.get(cookieKeys.token)
                        let res: Response
                        if (!isValidToken(token)) res = Response.json({ message: 'Token not found' }, { status: 401 })
                        const response = await fetch(`${import.meta.env.BASE_API}${"PATH_API.user.profile"}`,
                            {
                                cache: 'force-cache',
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        )
                        const result = await response.json()
                        if (!response.ok) {
                            res = Response.json({
                                message: result.message ?? "Internal Server Error"
                            }, { status: result.statusCode ?? 500, })
                        }
                        res = Response.json({
                            data: result.data,
                            message: result.message
                        }, { status: result.statusCode })
                        return setCorsHeaders(res)
                    }

                    /**
                     * [GET] /api/auth/:provider: Start OAuth flow
                     */
                    const oauthMatch = /^\/api\/auth\/([^/]+)$/.exec(pathname)
                    if (oauthMatch) {
                        const [, provider = ''] = oauthMatch
                        const instance = providers[provider]
                        if (!instance) throw new Error(`Provider ${provider} not found`)
                        const state = generateStateOrCode()
                        const codeVerifier = generateStateOrCode()
                        const redirectUrl = searchParams.get('redirect_url') ?? '/'
                        const callbackUrl = await instance.createAuthorizationURL(state, codeVerifier)
                        const response = new Response(null, {
                            status: 302,
                            headers: { Location: callbackUrl.toString() },
                        })
                        const opts = { Path: '/', MaxAge: 60 * 5 }
                        cookies.set(response, cookieKeys.state, state, opts)
                        cookies.set(response, cookieKeys.code, codeVerifier, opts)
                        cookies.set(response, cookieKeys.redirect, redirectUrl, opts)
                        return setCorsHeaders(response)
                    }

                    /**
                     * [GET] /api/auth/callback/:provider: Handle OAuth callback
                     */
                    const callbackMatch = /^\/api\/auth\/callback\/([^/]+)$/.exec(pathname)
                    if (callbackMatch) {
                        const [, provider = ''] = callbackMatch
                        const instance = options.providers[provider]
                        if (!instance) throw new Error(`Provider ${provider} not found`)
                        const code = searchParams.get('code') ?? ''
                        const state = searchParams.get('state') ?? ''
                        const storedState = cookies.get(cookieKeys.state) ?? ''
                        const codeVerifier = cookies.get(cookieKeys.code) ?? ''
                        const redirectTo = cookies.get(cookieKeys.redirect) ?? '/'
                        if (state !== storedState || !code || !codeVerifier)
                            throw new Error('Invalid state or code')
                        const tokenData = await instance.getAccessToken(code, codeVerifier)
                        const userData = await instance.fetchUser(tokenData)
                        // const ipAddress = request.headers.get('x-forwarded-for') ?? null
                        // const userAgent = request.headers.get('user-agent') ?? null
                        const session = await fetch(`${import.meta.env.BASE_API}${"PATH_API.auth.login"}`, {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...userData, provider })
                        })
                        const result = await session.json()
                        if (!session.ok) throw new Error(result.message ?? 'Internal Server Errror')
                        const Location = new URL(redirectTo, request.url).toString()
                        const response = new Response(null, {
                            status: 302,
                            headers: { Location }
                        })
                        for (const key of Object.values(cookieKeys))
                            cookies.delete(response, key)
                        const { exp } = jwtDecode(result.data.accessToken)
                        cookies.set(response, cookieKeys.token, result.data.accessToken, {
                            ...cookieOptions,
                            expires: new Date(exp * 1000)
                        })
                        return setCorsHeaders(response)
                    }
                    return setCorsHeaders(Response.json({ message: 'Route not found' }, { status: 404 }))
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Internal Server Error'
                    return setCorsHeaders(Response.json({ message, statusCode: 500 }, { status: 500 }))
                }
            },
            POST: async (request: Request) => {
                const cookies = new Cookies(request)
                const { pathname } = new URL(request.url)

                try {
                    /**
                     * [POST] /api/auth/sign-in: Sign in with email and password
                     */
                    if (pathname === '/api/auth/sign-in') {
                        const { email, password } = await request.json()
                        const response = await fetch(`${import.meta.env.BASE_API}${"PATH_API.auth.login"}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password, provider: 'credentials' })
                        })
                        const result = await response.json()
                        if (!response.ok) {
                            return setCorsHeaders(Response.json({
                                message: result.message.toString() ?? "Internal Server Error"
                            }, { status: result.statusCode ?? 500, }))
                        }
                        return setCorsHeaders(Response.json({
                            data: result.data,
                            message: result.message
                        }, { status: result.statusCode }))
                    }

                    /**
                     * [POST] /api/auth/sign-up: Sign up with new info
                     */
                    if (pathname === '/api/auth/sign-up') {
                        const { email, password, name } = await request.json()
                        const response = await fetch(`${import.meta.env.BASE_API}${"PATH_API.auth.register"}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password, name, provider: 'credentials' })
                        })
                        const result = await response.json()
                        if (!response.ok) {
                            return setCorsHeaders(Response.json({
                                statusCode: result.statusCode ?? 500,
                                message: result.message.toString() ?? "Internal Server Error"
                            }, { status: result.statusCode ?? 500, }))
                        }
                        return setCorsHeaders(Response.json({
                            data: result.data,
                            statusCode: result.statusCode,
                            message: result.message
                        }, { status: result.statusCode }))
                    }

                    /**
                     * [POST] /api/auth/sign-out: Sign out current session
                     */
                    if (pathname === '/api/auth/sign-out') {
                        const response = Response.json({ message: 'Signed out successfully' }, { status: 200 })
                        cookies.delete(response, cookieKeys.token)
                        return setCorsHeaders(response)
                    }
                    return setCorsHeaders(Response.json({ message: 'Route not found' }, { status: 404 }))
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Internal Server Error'
                    return setCorsHeaders(Response.json({ message, statusCode: 500 }, { status: 500 }))
                }
            }
        }
    }
}
