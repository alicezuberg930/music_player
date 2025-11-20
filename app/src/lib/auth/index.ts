import { authOptions } from './config'
import { Auth } from './core'

export const { handlers } = Auth(authOptions)
