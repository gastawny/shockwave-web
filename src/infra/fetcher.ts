import { API_URL } from '@/config/variables'
import { http, RequestOptions } from './http'
import { cookies } from './cookies'

interface FetcherOptions extends Omit<RequestInit, 'next'> {
  auth?: boolean
  justReturnResponse?: boolean
}

export async function fetcher(
  path: string,
  { auth = true, justReturnResponse = true, ...options }: FetcherOptions = {}
) {
  const authorization = (auth && (await cookies.get('at'))) || ''

  const response = await fetch(API_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authorization}`,
      ...options?.headers,
    },
  })

  if (justReturnResponse) {
    return response
  }

  return response.json()
}
