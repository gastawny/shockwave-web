import { ColumnDef } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Explosive } from '@/types/explosive'

export const columnsExplosives: ColumnDef<Explosive>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    cell: ({ row }) => {
      return <span className="max-w-[350px] truncate font-medium">{row.getValue('name')}</span>
    },
    footer: 'Nome',
  },
]
