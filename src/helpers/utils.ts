import { Regex } from '@/constants/regex'

/**
 * Returns a function that will only be executed after a certain amount of time has passed since the last time it was called.
 * @param func The function to debounce.
 * @param delay The amount of time to wait before executing the function.
 * @returns A debounced version of the function.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = undefined
    }, delay)
  }
}


export const nullToString = (value: any) => (value === null ? '' : value)

export const decodeJWT = (token: string) => {
  // Split the token into its parts
  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('Invalid JWT token')
  }

  // Base64 decode the payload (second part of the token)
  const payload = parts[1]
  const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))

  // Decode the UTF-8 string
  const utf8Decoder = new TextDecoder('utf-8')
  const decodedArray = new Uint8Array(decodedPayload.split('').map((char) => char.charCodeAt(0)))
  const parsedPayload = JSON.parse(utf8Decoder.decode(decodedArray))

  return parsedPayload
}

export const isEmail = (email: string) => Regex.email.test(email)

export const isValidRegex = (pattern: string) => {
  try {
    new RegExp(pattern)
    return true
  } catch (e) {
    return false
  }
}
