import express, { Request, Response } from "express"
import { validateRequest, JWTMiddleware, OptionalJWTMiddleware } from "@yukikaze/middleware"
import { SocialValidators } from "@yukikaze/validator"
import commentController from "./comment.controller"

const commentRouter = express.Router()

commentRouter.get(
    "/comments/:songId",
    OptionalJWTMiddleware,
    validateRequest(SocialValidators.getCommentsInput),
    (request: Request<{ songId: string }, {}, {}, SocialValidators.GetCommentsInput>, response: Response) =>
        commentController.listComments(request, response),
)

commentRouter.post(
    "/comments",
    JWTMiddleware,
    validateRequest(SocialValidators.createCommentInput),
    (request: Request<{}, {}, SocialValidators.CreateCommentInput>, response: Response) =>
        commentController.createComment(request, response),
)

export { commentRouter }
