'use client'

import { ColumnDef } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Button } from '@/components/ui/button'
import { InputsGround } from '@/screens/Cadastos/update-button'
import { http } from '@/infra/http'
import { toast } from '@/components/ui/use-toast'
import { Ground } from '@/types/ground'

async function handleDelete(id: number) {
  const res = await http(`/api/grounds/${id}`, { method: 'DELETE', revalidateTag: ['grounds'] })

  if (!res.ok) {
    toast({ variant: 'destructive', title: 'Erro ao excluir solo' })
  }

  toast({ title: 'Solo excluído com sucesso' })
}

export const columns: ColumnDef<Ground>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return <span className="max-w-[350px] truncate font-medium">{row.getValue('name')}</span>
    },
  },
  {
    accessorKey: 'k',
    header: ({ column }) => <DataTableColumnHeader column={column} title="k" />,
    cell: ({ row }) => {
      return <span className="max-w-[350px] truncate font-medium">{row.getValue('k')}</span>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'update',
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 justify-end">
          <InputsGround ground={row.original} method="PUT" />
          <Button onClick={() => handleDelete(row.original.id)} variant="destructive" size="sm">
            Excluir
          </Button>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]
