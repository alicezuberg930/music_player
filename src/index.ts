import express, { Request, Response } from "express";
import env from "./lib/env";
import userRouter from "./modules/users/user.route";
import songRouter from "./modules/songs/song.route";
import playlistRouter from "./modules/playlists/playlist.route";

const app = express();
// For parsing JSON request bodies
app.use(express.json());
// app.use(express.urlencoded({ extended: true }))

const port = env.PORT || 3000;

app.get("/", (_: Request, res: Response) => {
    res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// routers
app.use('/api/v1', [userRouter, playlistRouter, songRouter])

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});