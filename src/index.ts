import express, { Request, Response } from "express";
import env from "./lib/env";
import userRouter from "./modules/users/user.route";
import songRouter from "./modules/songs/song.route";

const app = express();
// For parsing JSON request bodies
app.use(express.json());
// app.use(express.urlencoded({ extended: true }))

const port = env.PORT || 3000;

app.get("/", (_: Request, res: Response) => {
    res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// song router
app.use('/api/v1', userRouter)
app.use('/api/v1', songRouter)

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});