'use client'

import { DataTable } from '@/components/data-table/data-table'
import { InputsGround } from '@/screens/Cadastos/update-button'
import { columns } from '@/utils/data/register-definitions/ground-columns'

export function RegisterTable({ data }: any) {
  return (
    <DataTable
      data={data}
      columns={columns}
      dataFilters={{
        filters: [],
        principalColumn: {
          key: 'name',
          title: 'Nome',
        },
        createButton: <InputsGround method="POST" />,
      }}
    />
  )
}
