import { Request, Response } from "express"
import { SendChatInput, QueryConversationsInput } from "@yukikaze/validator"
import { ChatService } from "./chat.service"

class ChatController {
    private readonly chatService: ChatService

    constructor() {
        this.chatService = new ChatService()
    }

    public async sendMessage(
        request: Request<{}, {}, SendChatInput>,
        response: Response,
    ) {
        return await this.chatService.sendChatMessage(request, response)
    }

    public async listConversation(
        request: Request<{ userId: string }, {}, {}, QueryConversationsInput>,
        response: Response,
    ) {
        return await this.chatService.listConversation(request, response)
    }
}

export default new ChatController()
