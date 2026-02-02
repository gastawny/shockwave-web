import { ColumnDef } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { PostExplosion } from '@/types/post-explosion'

export const columnsPostExplosion: ColumnDef<PostExplosion>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    cell: ({ row }) => {
      return <span className="max-w-[350px] truncate font-medium">{row.getValue('name')}</span>
    },
    footer: 'Nome',
  },
  {
    accessorKey: 'vestigeDistance',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Distância do Vestígio" />,
    cell: ({ row }) => {
      return (
        <span className="max-w-[350px] truncate font-medium">
          {row.getValue('vestigeDistance')}
        </span>
      )
    },
    filterFn: (row, id, value) => {
      const cell = String(row.getValue(id) ?? '')
      const filter = String(value ?? '')
      return cell.toLowerCase().includes(filter.toLowerCase())
    },
  },
]
