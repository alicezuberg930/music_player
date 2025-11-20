import type { GoogleUserResponse, OAuth2Token, OauthAccount } from '../types'
import BaseProvider, { OAuthClient } from './base'

export default class Google extends BaseProvider {
    public client: OAuthClient

    private authorizationEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
    private tokenEndpoint = 'https://oauth2.googleapis.com/token'
    private userEndpoint = 'https://openidconnect.googleapis.com/v1/userinfo'

    constructor(opts: {
        clientId: string,
        clientSecret: string,
        redirectUrl?: string
    }) {
        super()
        this.client = new OAuthClient(
            opts.clientId,
            opts.clientSecret,
            opts.redirectUrl ?? this.createCallbackUrl('google'),
        )
    }

    public override async createAuthorizationURL(state: string, codeVerifier: string): Promise<URL> {
        const url = await this.client.createAuthorizationUrlWithPKCE(
            this.authorizationEndpoint,
            state,
            ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'],
            codeVerifier
        )
        return url
    }

    override async getAccessToken(code: string, codeVerifier: string): Promise<OAuth2Token> {
        const tokenResponse = await this.client.validateAuthorizationCode(this.tokenEndpoint, code, codeVerifier)
        if (!tokenResponse.ok) {
            const error = await tokenResponse.text().catch(() => 'Unknown error')
            throw new Error(`Google API error: ${error}`)
        }
        const tokenData = await tokenResponse.json()
        console.log(tokenData)
        return tokenData
    }

    override async fetchUser(tokenData: OAuth2Token): Promise<OauthAccount> {
        const response = await fetch(this.userEndpoint, {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        })
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error')
            throw new Error(`Google API error (${response.status}): ${errorText}`)
        }
        const userData: GoogleUserResponse = await response.json()
        return {
            email: userData.email,
            name: userData.name,
            avatar: userData.picture,
        }
    }
}

