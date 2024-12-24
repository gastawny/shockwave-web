'use server'

import { revalidateTag } from 'next/cache'

export async function rTag(tag: string) {
  revalidateTag(tag)
}
