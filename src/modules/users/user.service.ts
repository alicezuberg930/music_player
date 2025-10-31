import { Request } from "express"
import { db } from "../../db"
import { usersTable } from "../../db/schemas"

export class UserService {
    public async getUsers(request: Request) {
        try {
            const users = await db.select().from(usersTable)
            return users
        } catch (error) {
            throw new Error(String(error))
        }
    }
}
