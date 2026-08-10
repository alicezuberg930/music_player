import { Request, Response } from "express"
import { QueryCommentsInput, CreateCommentInput } from "@yukikaze/validator"
import { CommentService } from "./comment.service"

class CommentController {
    private readonly commentService: CommentService

    constructor() {
        this.commentService = new CommentService()
    }

    public async createComment(
        request: Request<{}, {}, CreateCommentInput>,
        response: Response,
    ) {
        return await this.commentService.createComment(request, response)
    }

    public async listComments(
        request: Request<{ songId: string }, {}, {}, QueryCommentsInput>,
        response: Response,
    ) {
        return await this.commentService.listComments(request, response)
    }
}

export default new CommentController()
