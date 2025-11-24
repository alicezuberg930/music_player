import { useNavigate } from 'react-router-dom'
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react'
// types
import type { ActionMapType, AuthStateType, AuthUser, JWTContextType } from './types'
// components
import { useSnackbar } from '@/components/snackbar'
// http requests
import { fetchProfile, signIn } from '../http.client'

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const initialize = useCallback(async () => {
    try {
      const response = await fetchProfile()
      console.log(response)
      if (response.data && !response.statusCode) {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user: response.data as AuthUser
          },
        })
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            user: null
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

  const signin = useCallback(async (email: string, password: string) => {
    try {
      const response = await signIn(email, password)
      console.log(response.data)
      if (response.data && response.statusCode) {
        enqueueSnackbar(response.message ?? 'Lỗi không xác định', { variant: 'error' })
      } else {
        enqueueSnackbar(response.message)
        navigate('/', { replace: true })
        dispatch({
          type: Types.LOGIN,
          payload: {
            user: response.data as AuthUser
          },
        })
      }
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : 'Internal Server Error', { variant: 'error' })
    }
  }, [])

  const signup = useCallback(async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify({ email, password, name })
      })
      const result = await response.json()
      if (!response.ok) {
        enqueueSnackbar(result.message, { variant: 'error' })
      } else {
        dispatch({
          type: Types.REGISTER,
          payload: {
            user: result.data as AuthUser
          },
        })
        enqueueSnackbar(result.message)
        navigate('/', { replace: true })
      }
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : 'Internal Server Error', { variant: 'error' })
    }
  }, [])

  const signout = useCallback(() => {
    try {
      navigate('/', { replace: true })
      dispatch({ type: Types.LOGOUT })
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : 'Internal Server Error', { variant: 'error' })
    }
  }, [])

  const signInWithProvider = useCallback((provider: string) => {
    window.location.href = `/api/auth/${provider}`
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