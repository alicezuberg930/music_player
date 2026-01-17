import { useNavigate } from 'react-router-dom'
import { createContext, useEffect, useReducer, useCallback, useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
// types
import type { ActionMapType, AuthStateType, AuthUser, JWTContextType } from './types'
// components
import { useSnackbar } from '@/components/snackbar'
// http requests
import { fetchProfile, signIn, signOut, signUp } from '../httpClient'
import { paths } from '../route/paths'
import { useLocales } from '../locales'
import type { AuthValidators } from '@yukikaze/validator'
import { axios } from '../axiosConfig'
import { useDispatch, useSelector } from '@/redux/store'
import { setLastTokenRefresh } from '@/redux/slices/app'

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
  const isRefreshing = useRef<boolean>(false)
  const refreshTimerRef = useRef<number | null>(null)
  const { lastTokenRefresh } = useSelector(state => state.app)
  const dispatchRedux = useDispatch()

  const { data: profileData, isSuccess } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    retry: false,
  })

  useEffect(() => {
    if (isSuccess && profileData?.data) {
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: true,
          user: profileData.data
        },
      })
    }
  }, [isSuccess, profileData])

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
  }, [navigate, enqueueSnackbar, translate])

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
  }, [navigate, enqueueSnackbar, translate])

  const signout = useCallback(async () => {
    try {
      await signOut()
      dispatch({ type: Types.LOGOUT })
      navigate(paths.HOME, { replace: true })
      dispatchRedux(setLastTokenRefresh(null))
    } catch (error) {
      enqueueSnackbar(error instanceof Error ? error.message : translate('unknown_error'), { variant: 'error' })
    }
  }, [navigate, enqueueSnackbar, translate])

  const refreshToken = useCallback(async () => {
    if (isRefreshing.current) return
    isRefreshing.current = true
    try {
      const response = await axios.post('/auth/refresh-token')
      if (response.status === 200) {
        console.log('Token refreshed successfully')
        // Store the refresh timestamp
        dispatchRedux(setLastTokenRefresh(Date.now()))
      }
    } catch (error) {
      console.error('Failed to refresh token:', error)
      // If refresh fails, log out the user
      dispatch({ type: Types.LOGOUT })
      navigate(paths.HOME, { replace: true })
    } finally {
      isRefreshing.current = false
    }
  }, [navigate])

  const signInWithProvider = useCallback((provider: string) => {
    const apiUrl = import.meta.env.VITE_API_URL
    window.location.href = `${apiUrl}/auth/provider/${provider}`
  }, [])

  // Set up axios interceptor for automatic token refresh on 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use((response) => response,
      async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          try {
            await refreshToken()
            return axios(originalRequest)
          } catch (refreshError) {
            return Promise.reject(refreshError)
          }
        }
        return Promise.reject(error)
      }
    )
    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [refreshToken])

  // Set up automatic token refresh every 30 minutes  
  useEffect(() => {
    if (state.isAuthenticated) {
      // 29 minutes in milliseconds
      const REFRESH_INTERVAL = 29 * 60 * 1000
      // Check when the last refresh happened
      const now = Date.now()
      let timeUntilNextRefresh = REFRESH_INTERVAL

      if (lastTokenRefresh) {
        const timeSinceLastRefresh = now - lastTokenRefresh
        timeUntilNextRefresh = Math.max(REFRESH_INTERVAL - timeSinceLastRefresh, 0)
        // If it's been more than 29 minutes, refresh immediately
        if (timeSinceLastRefresh >= REFRESH_INTERVAL) {
          refreshToken()
          timeUntilNextRefresh = REFRESH_INTERVAL
        }
      } else {
        dispatchRedux(setLastTokenRefresh(now))
      }
      console.log(timeUntilNextRefresh / 1000, 'seconds until next token refresh')
      // Schedule the first refresh
      const initialTimer = setTimeout(() => {
        refreshToken()
        // set up recurring refresh if the user doesn't refresh the page
        refreshTimerRef.current = setInterval(() => {
          refreshToken()
        }, REFRESH_INTERVAL)
      }, timeUntilNextRefresh)

      return () => {
        clearTimeout(initialTimer)
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current)
        }
      }
    }
  }, [state.isAuthenticated, refreshToken])

  const memoizedValue = useMemo(() => ({
    isInitialized: state.isInitialized,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    signin,
    signInWithProvider,
    signup,
    signout,
    refreshToken
  }), [state, signin, signout, signup, signInWithProvider, refreshToken])

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>
}