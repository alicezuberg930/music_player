import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDuration = (duration: number) => {
  let hour = duration >= 3600 ? `${(Math.floor(duration / 3600)).toString()}:` : ''
  let minute = ((Math.floor(duration / 60) % 60)).toString().padStart(2, '0')
  let second = (duration % 60).toString().padStart(2, '0')
  return `${hour}${minute}:${second}`
}

export const roundPeopleAmount = (number: number) => {
  if (number > 1000 && number < 1000000) return `${(number / 1000).toFixed(1)}K`
  if (number > 1000000) return `${(number / 1000000).toFixed(1)}M`
}

export const convertMillisecondsToDate = (milliseconds: number) => {
  const date = new Date(milliseconds) // Convert milliseconds to Date object
  const day = String(date.getDate()).padStart(2, '0') // Add leading zero if necessary
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based, so we add 1
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const deepObjectComparison = (obj1: any, obj2: any) => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (let key of keys1) {
    if (!keys2.includes(key) || !deepObjectComparison(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}
