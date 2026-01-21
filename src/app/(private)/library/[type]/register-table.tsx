'use client'

import { DataTable } from '@/components/data-table/data-table'
import { infosModal } from '@/screens/library/infos-modal'
import { Tags } from '@/utils/constants/tags'
import { columnsDefinitions } from '@/utils/data/columns-definitions/'

export function RegisterTable({ data, type }: { data: any[]; type: (typeof Tags)[number] }) {
  return (
    <DataTable
      data={data}
      columns={columnsDefinitions[type]}
      dataFilters={{
        filters: [],
        principalColumn: {
          key: 'name',
          title: 'Nome',
        },
        createButton: infosModal[type]({ method: 'POST' }),
      }}
      type={type}
    />
  )
}
