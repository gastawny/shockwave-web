'use client'

import { RegisterTable } from './register-table'
import { useSuspenseQuery } from '@tanstack/react-query'
import { fetcher } from '@/infra/fetcher'
import { Tags } from '@/utils/constants/tags'

export default function LibraryTypePage({
  params: { type },
}: {
  params: { type: (typeof Tags)[number] }
}) {
  const { data } = useSuspenseQuery({
    queryKey: ['library', type],
    queryFn: async () => await fetcher(`/api/handlers/${type}`, { justReturnResponse: false }),
  })

  return <RegisterTable data={data} type={type} />
}
