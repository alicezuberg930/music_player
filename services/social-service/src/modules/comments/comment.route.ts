import express, { Request, Response } from "express"
import { validateRequest, JWTMiddleware, OptionalJWTMiddleware } from "@yukikaze/middleware"
import { queryCommentsInput, QueryCommentsInput, createCommentInput, CreateCommentInput } from "@yukikaze/validator"
import commentController from "./comment.controller"

const commentRouter = express.Router()

commentRouter.get(
    "/comments/:songId",
    OptionalJWTMiddleware,
    validateRequest(queryCommentsInput),
    (request: Request<{ songId: string }, {}, {}, QueryCommentsInput>, response: Response) =>
        commentController.listComments(request, response),
)

commentRouter.post(
    "/comments",
    JWTMiddleware,
    validateRequest(createCommentInput),
    (request: Request<{}, {}, CreateCommentInput>, response: Response) =>
        commentController.createComment(request, response),
)

export { commentRouter }
