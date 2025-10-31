import express, { Request, Response } from "express";
const songRouter = express.Router()
import songController from "./song.controller";

songRouter.all("/songs", async (request: Request, response: Response) => {
    switch (request.method) {
        case "GET":
            await songController.getUsers(request, response)
            break;
        case "POST":
            await songController.createUser(request, response)
            break;
        case "DELETE":
            response.json({ message: "You called DELETE /songs" });
            break;
        default:
            response.status(405).json({ message: `Method ${request.method} not allowed` });
            break;
    }
})

songRouter.get("/songs/:id", async (request: Request, response: Response) => {
    const { id } = request.params
    response.json({ id })
})

songRouter.put("/songs/:id", async (request: Request, response: Response) => {
    const { id } = request.params
    response.json({ id })
})

export default songRouter