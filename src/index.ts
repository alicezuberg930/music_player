import express, { Request, Response } from "express";
import env from "./lib/env";
import songRouter from "./modules/users/user.route";

const app = express();
// For parsing JSON request bodies
app.use(express.json());
// app.use(express.urlencoded({ extended: true }))

const port = env.PORT || 3000;

app.get("/", (_: Request, res: Response) => {
    res.json({ message: "Welcome to the Express + TypeScript Server!" });
});

// song router
app.use('/api/v1', songRouter)

app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});