'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { fetcher } from '@/infra/fetcher'
import { DataTable } from '@/components/data-table/data-table'
import { columnsExplosives } from '@/screens/library/columns-definitions/explosives-columns'
import { infosModal } from '@/screens/library/infos-modal'
import { ExplosiveImageButton } from '@/screens/library/infos-modal/components/explosive-image-modal'

export default function ExplosivesPage() {
  const { data } = useSuspenseQuery({
    queryKey: ['library', 'explosives'],
    queryFn: async () => await fetcher('/api/handlers/explosives', { justReturnResponse: false }),
  })

  return (
    <DataTable
      data={data}
      columns={columnsExplosives}
      dataFilters={{
        filters: [],
        createButton: infosModal['explosives']({ method: 'POST' }),
      }}
      type="explosives"
      extraActions={(row: any) => <ExplosiveImageButton id={row.id} />}
    />
  )
}
