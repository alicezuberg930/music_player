import express, { Request, Response } from "express"
import userController from "./user.controller"

const userRouter = express.Router()

userRouter.all("/users", async (request: Request, response: Response) => {
    switch (request.method) {
        case "GET":
            await userController.getUsers(request, response)
            break
        case "POST":
            await userController.createUser(request, response)
            break
        case "DELETE":
            response.json({ message: "You called DELETE /songs" })
            break
        default:
            response.status(405).json({ message: `Method ${request.method} not allowed` })
            break
    }
})

userRouter.get("/users/:id", async (request: Request, response: Response) => {
    const { id } = request.params
    response.json({ id })
})

userRouter.put("/users/:id", async (request: Request, response: Response) => {
    const { id } = request.params
    response.json({ id })
})

export { userRouter }