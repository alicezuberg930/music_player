import { CookieOptions } from "express"
import BaseProvider from "./providers/base"

export type GoogleUserResponse = {
  sub: string
  email: string
  name: string
  picture: string
}

export type FacebookUserResponse = {
  id: string
  email: string
  name: string
  picture: {
    data: { url: string }
  }
}

export type OauthAccount = {
  email: string
  name: string
  avatar: string
}

export type OAuth2Token = {
  access_token: string
  token_type: string
  expires_in: number
}

export interface AuthOptions {
  providers: Record<string, BaseProvider>
  cookieKeys?: {
    token?: string
    state?: string
    code?: string
    redirect?: string
  }
  cookieOptions?: CookieOptions
}