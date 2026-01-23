async function get(cookieName: string) {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers')

    return cookies().get(cookieName)?.value
  }

  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split('=')[1]
}

type SetCookieOptions = {
  expires?: Date | number
  httpOnly?: boolean
  path?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

async function set(cookieName: string, cookieValue: string, options: SetCookieOptions = {}) {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers')
    return cookies().set(cookieName, cookieValue, options)
  }

  const expiresStr = options.expires
    ? options.expires instanceof Date
      ? options.expires.toUTCString()
      : new Date(options.expires).toUTCString()
    : ''

  document.cookie = `${cookieName}=${cookieValue}${
    expiresStr ? `; expires=${expiresStr}` : ''
  }; path=${options.path ?? '/'}${options.secure ? '; secure' : ''}${
    options.sameSite ? `; samesite=${options.sameSite}` : ''
  }`
}

async function remove(cookieName: string, options: SetCookieOptions = {}) {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers')
    return cookies().delete(cookieName)
  }

  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${
    options.path ?? '/'
  }`
}

export const cookies = { get, set, remove }
