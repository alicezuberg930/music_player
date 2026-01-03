import { Request, Response } from "express"

export class OAuthService {
    public async handleProvider(request: Request<{ provider: string }>, response: Response) {
        const { provider } = request.params

    }
}