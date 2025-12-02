import { axios } from "../axiosConfig"

export function jwtDecode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  // Browser: Use window.atob with the original polyfill logic
  let jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  )

  return JSON.parse(jsonPayload);
}

export const isValidToken = (accessToken: string | undefined | null) => {
  if (!accessToken) return false

  const decoded = jwtDecode(accessToken)

  const currentTime = Date.now() / 1000

  return decoded.exp > currentTime
}

export const tokenExpired = (exp: number, action?: VoidFunction) => {
  let expiredTimer
  const currentTime = Date.now()
  // Test token expires after 10s
  // const timeLeft = currentTime + 5000 - currentTime // ~10s
  const timeLeft = exp * 1000 - currentTime
  clearTimeout(expiredTimer)
  expiredTimer = setTimeout(async () => {
    await fetch('/api/auth/sign-out', { method: "POST" })
    if (action) action()
  }, timeLeft)
}

export const setSession = (accessToken: string | null, action?: VoidFunction) => {
  if (accessToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    // This function below will handle when token is expired
    const { exp } = jwtDecode(accessToken)
    tokenExpired(exp, action)
  } else {
    fetch('/api/auth/sign-out', { method: "POST" }).then(res => {
      if (res.ok) delete axios.defaults.headers.common.Authorization
    })
  }
}