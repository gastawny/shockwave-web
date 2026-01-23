import { ColumnDef } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Ground } from '@/types/ground'

export const columnsGround: ColumnDef<Ground>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    cell: ({ row }) => {
      return <span className="max-w-[350px] truncate font-medium">{row.getValue('name')}</span>
    },
    footer: 'Nome',
  },
  {
    accessorKey: 'k',
    header: ({ column }) => <DataTableColumnHeader column={column} title="k" />,
    cell: ({ row }) => {
      return <span className="max-w-[350px] truncate font-medium">{row.getValue('k')}</span>
    },
    filterFn: (row, id, value) => {
      const cell = String(row.getValue(id) ?? '')
      const filter = String(value ?? '')
      return cell.toLowerCase().includes(filter.toLowerCase())
    },
  },
]
