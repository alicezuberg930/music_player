import express, { Request, Response } from "express";
const songRouter = express.Router()
import userController from "./user.controller";
import { db } from "../../db";
import { usersTable } from "../../db/schemas";

songRouter.get("/users", async (request: Request, response: Response) => {
    switch (request.method) {
        case "GET":
            await userController.getUsers(request, response)
            break;
        case "POST":
            response.json({ message: "You called POST /songs" });
            break;
        case "PUT":
            response.json({ message: "You called PUT /songs" });
            break;
        case "DELETE":
            response.json({ message: "You called DELETE /songs" });
            break;
        default:
            response.status(405).json({ message: `Method ${request.method} not allowed` });
            break;
    }
})

songRouter.get("/users/:id", async (request: Request, response: Response) => {

    // response.json({ id })
})

export default songRouter