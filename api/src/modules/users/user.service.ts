import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { db, eq } from "../../db"
import { users } from "../../db/schemas"
import { User } from "./user.model"
import { BadRequestException, HttpException, NotFoundException } from "../../lib/exceptions"
import { CreateUserDto } from "./dto/create-user.dto"
import { Password } from "../../lib/bcrypt/password"
import { LoginUserDto } from "./dto/login-user.dto"
import env from "../../lib/helpers/env"

export class UserService {
    public async getUsers(request: Request, response: Response) {
        try {
            const { } = request.query
            const data: User[] = await db.query.users.findMany({

            })
            return response.json({ message: 'User details fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async signIn(request: Request<{}, {}, LoginUserDto>, response: Response) {
        try {
            const { email, password } = request.body
            const user: User | undefined = await db.query.users.findFirst({ where: eq(users.email, email) })
            if (!user) throw new NotFoundException('User not found')
            const isPasswordValid = await new Password().verify(user.password!, password)
            if (!isPasswordValid) throw new BadRequestException('Invalid password')
            // Generate JWT access token
            const token = jwt.sign({ id: user.id }, env.JWT_SECRET!, { expiresIn: '1d', algorithm: 'HS256' })
            response.cookie('accessToken', token, {
                httpOnly: true,
                secure: env.NODE_ENV === "production" ? true : false, // Required for HTTPS
                sameSite: env.NODE_ENV === "production" ? 'lax' : 'strict', // Required for cross-domain cookies
                // domain: env.NODE_ENV === "production" ? '.aismartlite.cloud' : undefined, // Share cookie across subdomains
                maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
            });
            return response.json({
                message: 'User logged in successfully',
                data: { user, accessToken: token }
            })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async signUp(request: Request<{}, {}, CreateUserDto>, response: Response) {
        try {
            const { password, fullname, email } = request.body
            const hashedPassword = await new Password().hash(password)
            await db.insert(users).values({ fullname, email, password: hashedPassword })
            return response.status(201).json({ message: 'User registered successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async findUser(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const data: Omit<User, "password"> | undefined = await db.query.users.findFirst({
                columns: { password: false },
                where: eq(users.id, id),
                with: { songs: true, playlists: true }
            })
            if (!data) throw new NotFoundException('User not found')
            return response.json({ message: 'User details fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async myProfile(request: Request, response: Response) {
        try {
            if (!request.userId) throw new BadRequestException('User ID is missing in request')
            const data: Omit<User, "password"> | undefined = await db.query.users.findFirst({
                where: eq(users.id, request.userId),
                columns: { password: false }
            })
            if (!data) throw new NotFoundException('User not found')
            return response.json({ message: 'User details fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async signOut(_: Request, response: Response) {
        try {
            response.clearCookie('accessToken', {
                httpOnly: true,
                secure: env.NODE_ENV === "production" ? true : false, // Required for HTTPS
                sameSite: env.NODE_ENV === "production" ? 'none' : 'strict', // Required for cross-domain cookies
                // domain: env.NODE_ENV === "production" ? '.aismartlite.cloud' : undefined, // Share cookie across subdomains
            })
            return response.json({ message: 'User signed out successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}