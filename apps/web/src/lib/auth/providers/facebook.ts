import type { FacebookUserResponse, OAuth2Token, OauthAccount } from "../types"
import BaseProvider, { OAuthClient } from "./base"

export default class Facebook extends BaseProvider {
  public client: OAuthClient

  private authorizationEndpoint = 'https://www.facebook.com/v24.0/dialog/oauth'
  private tokenEndpoint = 'https://graph.facebook.com/v24.0/oauth/access_token'
  private apiEndpoint = 'https://graph.facebook.com/me'

  constructor(opts: {
    clientId: string
    clientSecret: string
    redirectUrl?: string
  }) {
    super()
    this.client = new OAuthClient(
      opts.clientId,
      opts.clientSecret,
      opts.redirectUrl ?? this.createCallbackUrl('facebook'),
    )
  }

  public override async createAuthorizationURL(state: string, _codeVerifier: string): Promise<URL> {
    const url = this.client.createAuthorizationURL(
      this.authorizationEndpoint,
      state,
      ['public_profile', 'email'],
    )
    return url
  }

  override async getAccessToken(code: string, _codeVerifier: string): Promise<OAuth2Token> {
    const tokenResponse = await this.client.validateAuthorizationCode(
      this.tokenEndpoint,
      code,
    )
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text().catch(() => 'Unknown error')
      throw new Error(`Facebook API error: ${error}`)
    }
    const tokenData: OAuth2Token = await tokenResponse.json()
    return tokenData
  }

  override async fetchUser(tokenData: OAuth2Token): Promise<OauthAccount> {
    const searchParams = new URLSearchParams()
    searchParams.set('access_token', tokenData.access_token)
    searchParams.set('fields', ['id', 'name', 'picture', 'email', 'birthday', 'gender'].join(','))
    const userResponse = await fetch(`${this.apiEndpoint}?${searchParams.toString()}`)
    if (!userResponse.ok) {
      const error = await userResponse.text().catch(() => 'Unknown error')
      throw new Error(`Facebook API error: ${error}`)
    }
    const userData: FacebookUserResponse = await userResponse.json()
    return {
      email: userData.email,
      name: userData.name,
      avatar: userData.picture.data.url,
    }
  }
}
