import { Request, Response } from "express"
import { db, eq } from "@yukikaze/db"
import { users } from "@yukikaze/db/schemas"
import { User } from "./local-auth.model"
import { BadRequestException, HttpException, NotFoundException } from "@yukikaze/lib/exception"
import { Password } from "@yukikaze/lib/password"
import { env } from "@yukikaze/lib/create-env"
import { createId } from "@yukikaze/lib/create-cuid"
import { JWT } from "@yukikaze/lib/jwt"
import sendEmail from "@yukikaze/email"
import { AuthValidators } from "@yukikaze/validator"
import { DEFAULT_OPTIONS } from "../../lib/helpers/auth"

export class UserService {
    private cookieOptions = DEFAULT_OPTIONS.cookieOptions;

    public async signIn(request: Request<{}, {}, AuthValidators.LoginInput>, response: Response) {
        try {
            const { email, password } = request.body
            const user: User | undefined = await db.query.users.findFirst({ where: eq(users.email, email) })
            if (!user) throw new NotFoundException('User not found')

            const isPasswordValid = await new Password().verify(user.password!, password)
            if (!isPasswordValid) throw new BadRequestException('Invalid password')

            // Generate JWT access token & refresh token
            const accessToken = await new JWT(env.ACCESS_TOKEN_SECRET).sign({ id: user.id }, { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN })
            const refreshToken = await new JWT(env.REFRESH_TOKEN_SECRET).sign({ id: user.id }, { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN })

            response.cookie('accessToken', accessToken, {
                ...this.cookieOptions,
                maxAge: env.ACCESS_TOKEN_EXPIRES_IN * 1000
            })
            response.cookie('refreshToken', refreshToken, {
                ...this.cookieOptions,
                maxAge: env.REFRESH_TOKEN_EXPIRES_IN * 1000
            })

            // Remove password from user object before returning
            const { password: _, ...userWithoutPassword } = user
            return response.json({
                message: 'User logged in successfully',
                data: { user: userWithoutPassword, accessToken, refreshToken }
            })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async signUp(request: Request<{}, {}, AuthValidators.RegisterInput>, response: Response) {
        try {
            const { password, fullname, email } = request.body
            const existingUser: User | undefined = await db.query.users.findFirst({ where: eq(users.email, email) })
            if (existingUser) throw new BadRequestException('Email is already registered')
            const hashedPassword = await new Password().hash(password)
            const verifyToken = await new Password().hash(createId())
            const verifyTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour from now
            const user = await db.insert(users).values({ fullname, email, password: hashedPassword, verifyToken, verifyTokenExpires }).$returningId()
            const verifyLink = `${env.NODE_ENV === "production" ? 'https://tien-music-player.site' : 'http://localhost:5173'}/verify/${user[0]!.id}?token=${verifyToken}`
            sendEmail({
                to: email,
                subject: 'Verify Your Email - Yukikaze Music Player',
                template: 'VerifyEmail',
                data: { username: fullname, verifyLink }
            })
                .then(_ => console.log('Verification email sent successfully'))
                .catch(err => console.error('Failed to send verification email:', err))
            const accessToken = await new JWT(env.ACCESS_TOKEN_SECRET).sign({ id: user[0]!.id }, { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN })
            const refreshToken = await new JWT(env.REFRESH_TOKEN_SECRET).sign({ id: user[0]!.id }, { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN })
            response.cookie('accessToken', accessToken, {
                ...this.cookieOptions,
                maxAge: env.ACCESS_TOKEN_EXPIRES_IN * 1000
            })
            response.cookie('refreshToken', refreshToken, {
                ...this.cookieOptions,
                maxAge: env.REFRESH_TOKEN_EXPIRES_IN * 1000
            })
            return response.status(201).json({ message: 'User registered successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async signOut(_: Request, response: Response) {
        try {
            response.clearCookie('accessToken', this.cookieOptions)
            response.clearCookie('refreshToken', this.cookieOptions)
            // Tell browser to clear cached responses that depend on auth
            // todo: blacklist refresh tokens to prevent reuse

            response.set('Clear-Site-Data', '"cache", "cookies"')
            return response.json({ message: 'User signed out successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async refreshToken(request: Request, response: Response) {
        try {
            const refreshToken = request.cookies['refreshToken']
            if (!refreshToken) throw new BadRequestException('No refresh token provided')
            const payload = await new JWT(env.REFRESH_TOKEN_SECRET).verify(refreshToken)
            if (!payload || !payload.id) throw new BadRequestException('Invalid refresh token')
            const user = await db.query.users.findFirst({ where: eq(users.id, payload.id as string) })
            const accessToken = await new JWT(env.ACCESS_TOKEN_SECRET).sign({ id: user!.id }, { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN })
            response.cookie('accessToken', accessToken, {
                ...this.cookieOptions,
                maxAge: env.ACCESS_TOKEN_EXPIRES_IN * 1000
            })
            return response.json({
                message: 'Access token refreshed successfully',
                data: { accessToken }
            })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}