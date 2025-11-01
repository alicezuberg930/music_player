import express, { Request, Response } from "express";
const playlistRouter = express.Router()
import playlistController from "./playlist.controller";

playlistRouter.all("/playlists", async (request: Request, response: Response) => {
    switch (request.method) {
        case "GET":
            await playlistController.getPlaylists(request, response)
            break;
        case "POST":
            await playlistController.createPlaylist(request, response)
            break;
        case "DELETE":
            response.json({ message: "You called DELETE /songs" });
            break;
        default:
            response.status(405).json({ message: `Method ${request.method} not allowed` });
            break;
    }
})

playlistRouter.get("/playlists/:id", async (request: Request, response: Response) => {
    const { id } = request.params
    response.json({ id })
})

playlistRouter.put("/playlists/:id", async (request: Request, response: Response) => {
    const { id } = request.params
    response.json({ id })
})

export default playlistRouter