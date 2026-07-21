import { toast } from "@yukikaze/ui"
import { HttpError } from "./repository/http-error"

const showResponseError = (error: unknown) => {
  const httpError = error instanceof HttpError ? error : undefined

  if (httpError) {
    if (httpError.status === 401) {
      // Keep centralized toast flow for auth errors.
    }
    const data = httpError.data as { message?: unknown } | undefined
    const err = data?.message ?? httpError.message
    if (Array.isArray(err)) {
      err.forEach((e) => toast.error(String(e)))
    } else {
      toast.error(String(err))
    }
  } else if (error instanceof Error) {
    toast.error(error.message)
  } else {
    toast.error('Lỗi không xác định')
  }
}

const formatDuration = (duration: number): string => {
  const hour = duration >= 3600 ? `${(Math.floor(duration / 3600)).toString()}:` : ''
  const minute = ((Math.floor(duration / 60) % 60)).toString().padStart(2, '0')
  const second = (duration % 60).toString().padStart(2, '0')
  return `${hour}${minute}:${second}`
}

const formatPeopleNumber = (number: number): string => {
  if (number > 1000 && number < 1000000) return `${(number / 1000).toFixed(1)}K`
  if (number > 1000000) return `${(number / 1000000).toFixed(1)}M`
  return number.toString()
}

const deepObjectComparison = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepObjectComparison(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}

export const getBaseUrl = (): string => {
  if (typeof globalThis !== 'undefined') return globalThis.location.origin
  if (import.meta.env.PRODUCTION_URL) return import.meta.env.PRODUCTION_URL
  return `http://localhost:${import.meta.env.PORT ?? 3000}`
}

const alpha = (color: string, opacity: number): string => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  // Handle rgb/rgba colors
  if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g)
    if (match && match.length >= 3) {
      return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${opacity})`
    }
  }
  return `rgba(0, 0, 0, ${opacity})`
}

// Source - https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = <T>(array: T[]): T[] => {
  let currentIndex = array.length
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
  return array
}

const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const base64String = btoa(String.fromCodePoint(...new Uint8Array(digest)))
  return base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

const generateStateOrCode = (): string => {
  const randomValues = new Uint8Array(32)
  crypto.getRandomValues(randomValues)
  return btoa(String.fromCodePoint(...randomValues))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export { showResponseError, shuffle, alpha, deepObjectComparison, formatPeopleNumber, formatDuration, generateCodeChallenge, generateStateOrCode }
