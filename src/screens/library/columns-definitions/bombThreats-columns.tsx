import { ColumnDef } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { BombThreat } from '@/types/bomb-threat'

export const columnsBombThreats: ColumnDef<BombThreat>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Identificação" />,
    cell: ({ row }) => {
      return <span className="max-w-[350px] truncate font-medium">{row.getValue('name')}</span>
    },
    filterFn: (row, id, value) => {
      const cell = String(row.getValue(id) ?? '')
      const filter = String(value ?? '')
      return cell.toLowerCase().includes(filter.toLowerCase())
    },
    footer: 'Identificação',
  },
  {
    id: 'formThreat',
    accessorFn: (row) => row?.formThreat?.name,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Formato do Objeto" />,
    cell: ({ row }) => {
      return (
        <span className="max-w-[350px] truncate font-medium">{row.getValue('formThreat')}</span>
      )
    },
  },
  {
    id: 'locatedObject',
    accessorFn: (row) => row?.locatedObject?.name,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Objeto Localizado" />,
    cell: ({ row }) => {
      return (
        <span className="max-w-[350px] truncate font-medium">
          {row.getValue('locatedObject') ?? '-'}
        </span>
      )
    },
  },
]
