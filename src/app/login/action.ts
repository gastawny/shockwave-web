'use server'
import { cookies } from '@/infra/cookies'
import { http } from '@/infra/http'
import { redirect } from 'next/navigation'

export async function onSubmit(data: { username: string; password: string }) {
  const res = await http('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!res.ok) return

  const { accessToken, refreshToken, username } = await res.data

  cookies.set('ac', accessToken)
  cookies.set('rf', refreshToken)
  cookies.set('username', username)

  redirect('/')
}
