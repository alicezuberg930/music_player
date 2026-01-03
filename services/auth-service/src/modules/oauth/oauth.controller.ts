import { Request, Response } from "express"
import { OAuthService } from "./oauth.service"

class OAuthController {
    private readonly oauthService: OAuthService

    constructor() {
        this.oauthService = new OAuthService()
    }

    public async handleProvider(request: Request<{ provider: string }>, response: Response) {
        return await this.oauthService.handleProvider(request, response)
    }
}

export default new OAuthController()