import { Request, Response } from "express"
import { db, eq } from "../../db"
import { users } from "../../db/schemas"
import { User } from "./user.model"
import { BadRequestException, HttpException, NotFoundException } from "../../lib/exceptions"

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

    public async createUser(request: Request) {
        try {
            const user = request.body as User
            const data = await db.insert(users).values(user)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async findUser(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const data: User | undefined = await db.query.users.findFirst({
                where: eq(users.id, parseInt(id)),
                with: { songs: true, playlists: true }
            })
            if (!data) throw new NotFoundException('User not found')
            return response.json({ message: 'User details fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async findMyProfile(request: Request, response: Response) {
        try {
            const data: User | undefined = await db.query.users.findFirst({
                where: eq(users.id, request.userId!),
                with: { songs: true, playlists: true }
            })
            if (!data) throw new NotFoundException('User not found')
            return response.json({ message: 'User details fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}