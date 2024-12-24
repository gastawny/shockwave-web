import { API_URL } from '@/config/variables'
import { cookies } from '@/infra/cookies'
import { rTag } from './rTag'
import { Tags } from '@/utils/constants/tags'

interface RequestOptions extends Omit<RequestInit, 'next'> {
  tenant?: string
  auth?: boolean
  revalidateTag?: (typeof Tags)[number][]
  tags?: (typeof Tags)[number][]
}

export async function http(
  path: string,
  { auth = true, revalidateTag = [], tags = [], ...options }: RequestOptions = {}
) {
  const authorization = (auth && (await cookies.get('at'))) || ''

  const res = await fetch(API_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authorization}`,
      ...options?.headers,
    },
    next: {
      tags,
    },
  })

  await Promise.all(revalidateTag.map(async (tag) => rTag(tag)))

  return res
}
