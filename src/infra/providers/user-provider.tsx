'use client'

import { useEffect } from 'react'
import { useUserStore } from '../stores/user-store-provider'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '../fetcher'
import { cookies } from '../cookies'
import { User } from '@/types/user'

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useUserStore()

  const { data } = useQuery<User>({
    queryKey: ['me'],
    queryFn: async () => {
      const email = await cookies.get('e')

      const res = await fetcher('/api/handlers/generic/users/findByEmail', {
        method: 'POST',
        body: JSON.stringify({ email: email || '' }),
      })

      if (!res.ok) {
        throw new Error('Failed to fetch user')
      }

      return await res.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
  })

  useEffect(() => {
    if (data) {
      setUser(data)
    }
  }, [data, setUser])

  return <>{children}</>
}
