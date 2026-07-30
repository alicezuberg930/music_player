import { Request, Response } from "express"
import { SocialValidators } from "@yukikaze/validator"
import { CommentService } from "./comment.service"

class CommentController {
    private readonly commentService: CommentService

    constructor() {
        this.commentService = new CommentService()
    }

    public async createComment(
        request: Request<{}, {}, SocialValidators.CreateCommentInput>,
        response: Response,
    ) {
        return await this.commentService.createComment(request, response)
    }

    public async listComments(
        request: Request<{ songId: string }, {}, {}, SocialValidators.GetCommentsInput>,
        response: Response,
    ) {
        return await this.commentService.listComments(request, response)
    }
}

export default new CommentController()
