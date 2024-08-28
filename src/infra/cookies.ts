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

async function set(cookieName: string, cookieValue: string, options: { expires?: Date } = {}) {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers')
    return cookies().set(cookieName, cookieValue, options)
  }

  document.cookie = `${cookieName}=${cookieValue}; expires=${options.expires}`
}

export const cookies = { get, set }
