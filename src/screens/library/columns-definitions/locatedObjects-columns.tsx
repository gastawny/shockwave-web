import { ColumnDef } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { LocatedObject } from '@/types/located-object'

export const columnsLocatedObjects: ColumnDef<LocatedObject>[] = [
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
    id: 'explosive',
    accessorFn: (row) => row?.explosive?.name,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Explosivo" />,
    cell: ({ row }) => {
      return <span className="max-w-[350px] truncate font-medium">{row.getValue('explosive')}</span>
    },
  },
  {
    id: 'ground',
    accessorFn: (row) => row?.ground?.name,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo de Solo" />,
    cell: ({ row }) => {
      return <span className="max-w-[350px] truncate font-medium">{row.getValue('ground')}</span>
    },
  },
  {
    id: 'objectFormat',
    accessorFn: (row) => row?.objectFormat?.name,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Formato do Objeto" />,
    cell: ({ row }) => {
      return (
        <span className="max-w-[350px] truncate font-medium">{row.getValue('objectFormat')}</span>
      )
    },
  },
]
