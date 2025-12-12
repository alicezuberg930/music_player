import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { and, db, eq } from "@yukikaze/db"
import { playlists, songs, userFavoritePlaylists, userFavoriteSongs, users } from "@yukikaze/db/schemas"
import { User } from "./user.model"
import { BadRequestException, HttpException, NotFoundException } from "../../lib/exceptions"
import { CreateUserDto } from "./dto/create-user.dto"
import { Password } from "../../lib/bcrypt/password"
import { LoginUserDto } from "./dto/login-user.dto"
import { env } from "@yukikaze/lib/create-env"
import { UpdateUserDto } from "./dto/update-user.dto"
import { createId } from "@yukikaze/lib/create-cuid"
import sendEmail from "../../lib/email"

export class UserService {
    public async getUsers(request: Request, response: Response) {
        try {
            // const { } = request.query
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
                secure: env.NODE_ENV === "production", // Required for HTTPS
                sameSite: env.NODE_ENV === "production" ? 'lax' : 'strict', // Required for cross-domain cookies
                domain: env.NODE_ENV === "production" ? '.tien-music-player.site' : undefined, // Share cookie across subdomains
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
            const existingUser: User | undefined = await db.query.users.findFirst({ where: eq(users.email, email) })
            if (existingUser) throw new BadRequestException('Email is already registered')
            const hashedPassword = await new Password().hash(password)
            const verifyToken = await new Password().hash(createId())
            const verifyTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour from now
            const user = await db.insert(users).values({ fullname, email, password: hashedPassword, verifyToken, verifyTokenExpires }).$returningId()
            const verifyLink = `${env.NODE_ENV === "production" ? 'https://tien-music-player.site' : 'http://localhost:5173'}/verify/${user[0].id}?token=${verifyToken}`
            sendEmail({
                to: email,
                subject: 'Verify Your Email - Yukikaze Music Player',
                template: 'VerifyEmail',
                data: { username: fullname, verifyLink }
            })
                .then(_ => console.log('Verification email sent successfully'))
                .catch(err => console.error('Failed to send verification email:', err))
            const token = jwt.sign({ id: user[0].id }, env.JWT_SECRET!, { expiresIn: '1d', algorithm: 'HS256' })
            response.set('Cache-Control', 'private, must-revalidate, max-age=3600')
            response.cookie('accessToken', token, {
                httpOnly: true,
                secure: env.NODE_ENV === "production", // Required for HTTPS
                sameSite: env.NODE_ENV === "production" ? 'lax' : 'strict', // Required for cross-domain cookies
                domain: env.NODE_ENV === "production" ? '.tien-music-player.site' : undefined, // Share cookie across subdomains
                maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
            });
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
            // Cache privately (per-user), must revalidate on each request
            response.set('Cache-Control', 'private, must-revalidate, max-age=3600')
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
                secure: env.NODE_ENV === "production", // Required for HTTPS
                sameSite: env.NODE_ENV === "production" ? 'lax' : 'strict', // Required for cross-domain cookies
                domain: env.NODE_ENV === "production" ? '.tien-music-player.site' : undefined, // Share cookie across subdomains
            })
            // Tell browser to clear cached responses that depend on auth
            response.set('Clear-Site-Data', '"cache", "cookies"')
            return response.json({ message: 'User signed out successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async updateUser(request: Request<{ id: string }, {}, UpdateUserDto>, response: Response) {
        try {
            const { id } = request.params
            const { fullname, email, password } = request.body
            return response.json({ message: 'User updated successfully', data: { id, fullname, email, password } })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async verifyEmail(request: Request<{ id: string }, {}, {}, { token: string }>, response: Response) {
        try {
            const { id } = request.params
            const { token } = request.query
            const user: User | undefined = await db.query.users.findFirst({ where: and(eq(users.id, id)) })
            if (!user) throw new NotFoundException('User not found')
            if (user.isVerified) return response.json({ message: 'Email is already verified' })
            if (user.verifyToken && user.verifyToken !== token) throw new BadRequestException('Invalid verification token')
            if (user.verifyTokenExpires && user.verifyTokenExpires < new Date()) throw new BadRequestException('Verification token has expired')
            await db.update(users).set({ isVerified: true, verifyToken: null, verifyTokenExpires: null }).where(eq(users.id, user.id))
            return response.json({ message: 'Email verified successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async userSongs(request: Request<{}, {}, { type?: 'upload' | 'favorite', page?: number, count?: number }>, response: Response) {
        try {
            // const { type, page, count } = request.body
            const data = await db.query.songs.findMany({ where: eq(songs.userId, request.userId!) })
            return response.json({ message: 'User songs fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async userPlaylists(request: Request, response: Response) {
        try {
            const data = await db.query.playlists.findMany({ where: eq(playlists.userId, request.userId!) })
            return response.json({ message: 'User playlists fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async addFavoriteSong(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const song = await db.query.songs.findFirst({ where: eq(songs.id, id) })
            if (!song) throw new NotFoundException('Song not found')
            const checkExisting = await db.query.userFavoriteSongs.findFirst({
                where: and(
                    eq(userFavoriteSongs.userId, request.userId!),
                    eq(userFavoriteSongs.songId, id)
                )
            })
            if (checkExisting) throw new BadRequestException('Song is already in favorites')
            await db.insert(userFavoriteSongs).values({ userId: request.userId!, songId: id })
            await db.update(songs).set({ likes: song.likes! + 1 }).where(eq(songs.id, id))
            return response.json({ message: 'Song added to favorites successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async removeFavoriteSong(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const song = await db.query.songs.findFirst({ where: eq(songs.id, id) })
            if (!song) throw new NotFoundException('Song not found')
            const checkExisting = await db.query.userFavoriteSongs.findFirst({
                where: and(
                    eq(userFavoriteSongs.userId, request.userId!),
                    eq(userFavoriteSongs.songId, id)
                )
            })
            if (!checkExisting) throw new BadRequestException('Song is not in favorites')
            await db.delete(userFavoriteSongs).where(
                and(
                    eq(userFavoriteSongs.userId, request.userId!),
                    eq(userFavoriteSongs.songId, id)
                )
            )
            await db.update(songs).set({ likes: song.likes! - 1 }).where(eq(songs.id, id))
            return response.json({ message: 'Song removed from favorites successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async addFavoritePlaylist(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const playlist = await db.query.playlists.findFirst({ where: eq(playlists.id, id) })
            if (!playlist) throw new NotFoundException('Playlist not found')
            const checkExisting = await db.query.userFavoritePlaylists.findFirst({
                where: and(
                    eq(userFavoritePlaylists.userId, request.userId!),
                    eq(userFavoritePlaylists.playlistId, id)
                )
            })
            if (checkExisting) throw new BadRequestException('Playlist is already in favorites')
            await db.insert(userFavoritePlaylists).values({ userId: request.userId!, playlistId: id })
            await db.update(playlists).set({ likes: playlist.likes! + 1 }).where(eq(playlists.id, id))
            return response.json({ message: 'Playlist added to favorites successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async removeFavoritePlaylist(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const playlist = await db.query.playlists.findFirst({ where: eq(playlists.id, id) })
            if (!playlist) throw new NotFoundException('Playlist not found')
            const checkExisting = await db.query.userFavoritePlaylists.findFirst({
                where: and(
                    eq(userFavoritePlaylists.userId, request.userId!),
                    eq(userFavoritePlaylists.playlistId, id)
                )
            })
            if (!checkExisting) throw new BadRequestException('Playlist is not in favorites')
            await db.delete(userFavoritePlaylists).where(
                and(
                    eq(userFavoritePlaylists.userId, request.userId!),
                    eq(userFavoritePlaylists.playlistId, id)
                )
            )
            await db.update(playlists).set({ likes: playlist.likes! - 1 }).where(eq(playlists.id, id))
            return response.json({ message: 'Playlist removed from favorites successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}