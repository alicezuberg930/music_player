import { useNavigate } from 'react-router-dom'
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react'
// types
import type { ActionMapType, AuthStateType, AuthUser, JWTContextType } from './types'
// components
import { useSnackbar } from '@/components/snackbar'
// http requests
import { fetchProfile, signIn, signOut, signUp } from '../httpClient'
import { paths } from '../route/paths'
import { useLocales } from '../locales'
import type { AuthValidators } from '@yukikaze/validator'

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean
    user: AuthUser | null
  }
  [Types.LOGIN]: {
    user: AuthUser
  }
  [Types.REGISTER]: {
    user: AuthUser
  }
  [Types.LOGOUT]: undefined
}

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>]

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null
}

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    }
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    }
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    }
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    }
  }
  return state
}

export const AuthContext = createContext<JWTContextType | null>(null)

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { translate } = useLocales()

  const initialize = useCallback(async () => {
    try {
      const response = await fetchProfile()
      if (response.statusCode === 200) {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user: response.data!
          },
        })
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    initialize()
  }, [initialize])

  const signin = useCallback(async (data: AuthValidators.LoginInput) => {
    try {
      const response = await signIn(data)
      if (response.statusCode === 200) {
        navigate(paths.HOME, { replace: true })
        enqueueSnackbar(response.message, { variant: 'success' })
        dispatch({
          type: Types.LOGIN,
          payload: {
            user: response.data?.user!
          },
        })
      }
      else {
        enqueueSnackbar(translate(response.message), { variant: 'error' })
      }
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : translate('unknown_error'), { variant: 'error' })
    }
  }, [initialize])

  const signup = useCallback(async (data: AuthValidators.RegisterInput) => {
    try {
      const response = await signUp(data)
      if (response.statusCode === 201) {
        dispatch({
          type: Types.REGISTER,
          payload: {
            user: response.data as AuthUser
          },
        })
        enqueueSnackbar(response.message)
        navigate('/', { replace: true })
      } else {
        enqueueSnackbar(translate(response.message), { variant: 'error' })
      }
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : translate('unknown_error'), { variant: 'error' })
    }
  }, [initialize])

  const signout = useCallback(async () => {
    try {
      await signOut()
      dispatch({ type: Types.LOGOUT })
      navigate('/', { replace: true })
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : translate('unknown_error'), { variant: 'error' })
    }
  }, [initialize])

  const signInWithProvider = useCallback((provider: string) => {
    globalThis.location.href = `/api/auth/${provider}`
  }, [])

  const memoizedValue = useMemo(() => ({
    isInitialized: state.isInitialized,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    signin,
    signInWithProvider,
    signup,
    signout,
  }), [state, signin, signout, signup, signInWithProvider])

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
}