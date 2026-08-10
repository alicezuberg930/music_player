import express, { Request, Response } from "express"
import { JWTMiddleware, validateRequest } from "@yukikaze/middleware"
import { sendChatInput, SendChatInput, QueryConversationsInput, queryConversationsInput } from "@yukikaze/validator"
import chatController from "./chat.controller"

const chatRouter = express.Router()

chatRouter.post(
    "/chats",
    JWTMiddleware,
    validateRequest(sendChatInput),
    (request: Request<{}, {}, SendChatInput>, response: Response) =>
        chatController.sendMessage(request, response),
)

chatRouter.get(
    "/chats/:userId",
    JWTMiddleware,
    validateRequest(queryConversationsInput),
    (request: Request<{ userId: string }, {}, {}, QueryConversationsInput>, response: Response) =>
        chatController.listConversation(request, response),
)

export { chatRouter }
