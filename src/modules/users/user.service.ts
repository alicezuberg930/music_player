import { Request } from "express"
import { db } from "../../db"
import { users } from "../../db/schemas"
import { User } from "./user.model"

export class UserService {
    public async getUsers(request: Request) {
        try {
            const data: User[] = await db.query.users.findMany({
                with: {
                    playlists: true,
                    songs: true
                }
            })
            return data
        } catch (error) {
            throw new Error(String(error))
        }
    }

    public async createUser(request: Request) {
        try {
            const user = request.body as User
            const data = await db.insert(users).values(user)
            return data
        } catch (error) {
            throw new Error(String(error))
        }
    }

}
