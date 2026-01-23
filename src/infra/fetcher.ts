import { API_URL } from '@/config/variables'
import { http, RequestOptions } from './http'
import { cookies } from './cookies'

interface FetcherOptions extends Omit<RequestInit, 'next'> {
  auth?: boolean
  justReturnResponse?: boolean
}

export async function fetcher(
  path: string,
  { justReturnResponse = true, ...options }: FetcherOptions = {}
) {
  const at = (await cookies.get('at')) || ''

  if (at) {
    if (!options.headers) {
      options.headers = {}
    }
    ;(options.headers as Record<string, string>).Authorization = `Bearer ${at}`
  }

  const response = await fetch(API_URL + path, {
    ...options,
    headers: {
      'Content-Type': options?.headers?.['Content-Type'] || 'application/json',
      ...options?.headers,
    },
  })

  if (justReturnResponse) {
    return response
  }

  return response.json()
}
