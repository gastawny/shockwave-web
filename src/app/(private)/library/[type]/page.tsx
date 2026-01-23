'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { fetcher } from '@/infra/fetcher'
import { Tags } from '@/utils/constants/tags'
import { DataTable } from '@/components/data-table/data-table'
import { columnsDefinitions } from '@/screens/library/columns-definitions'
import { infosModal } from '@/screens/library/infos-modal'

export default function LibraryTypePage({
  params: { type },
}: {
  params: { type: (typeof Tags)[number] }
}) {
  const { data } = useSuspenseQuery({
    queryKey: ['library', type],
    queryFn: async () => await fetcher(`/api/handlers/${type}`, { justReturnResponse: false }),
  })

  return (
    <DataTable
      data={data}
      columns={columnsDefinitions[type]}
      dataFilters={{
        filters: [],
        createButton: infosModal[type]({ method: 'POST' }),
      }}
      type={type}
    />
  )
}
