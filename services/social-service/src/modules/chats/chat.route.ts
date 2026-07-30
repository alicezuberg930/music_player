import express, { Request, Response } from "express"
import { JWTMiddleware, validateRequest } from "@yukikaze/middleware"
import { SocialValidators } from "@yukikaze/validator"
import chatController from "./chat.controller"

const chatRouter = express.Router()

chatRouter.post(
    "/chats",
    JWTMiddleware,
    validateRequest(SocialValidators.sendChatInput),
    (request: Request<{}, {}, SocialValidators.SendChatInput>, response: Response) =>
        chatController.sendMessage(request, response),
)

chatRouter.get(
    "/chats/:userId",
    JWTMiddleware,
    validateRequest(SocialValidators.getConversationsInput),
    (request: Request<{ userId: string }, {}, {}, SocialValidators.GetConversationsInput>, response: Response) =>
        chatController.listConversation(request, response),
)

export { chatRouter }
