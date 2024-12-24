import { cookies } from '@/infra/cookies'
import { http } from '@/infra/http'

export function useAuth() {
  async function signIn({ username, password }: { username: string; password: string }) {
    const res = await http('/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      throw new Error('Credenciais inválidas')
    }

    const data = await res.json()

    cookies.set('access_token', data?.accessToken, { expires: data?.expiration })
    cookies.set('refresh_token', data?.refreshToken, { expires: data?.expiration })
    cookies.set('username', JSON.stringify(data?.user), { expires: data?.expiration })
  }

  return {
    signIn,
  }
}
