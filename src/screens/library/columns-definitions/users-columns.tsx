import { ColumnDef } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { User } from '@/types/user'
import { Role } from '@/utils/constants/roles'

export const columnsUsers: ColumnDef<User>[] = [
  {
    id: 'fullName',
    accessorFn: (row) => row.firstName + ' ' + row.lastName,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome Completo" />,
    cell: ({ row }) => {
      return <span className="max-w-[350px] truncate font-medium">{row.getValue('fullName')}</span>
    },
    filterFn: (row, id, value) => {
      const cell = String(row.getValue(id) ?? '')
      const filter = String(value ?? '')
      return cell.toLowerCase().includes(filter.toLowerCase())
    },
    footer: 'Nome Completo',
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      return <span className="max-w-[350px] truncate font-medium">{row.getValue('email')}</span>
    },
  },
  {
    id: 'roles',
    accessorKey: 'roles',
    header: ({ column }) => (
      <DataTableColumnHeader ascDesc={false} column={column} title="Permissões" />
    ),
    cell: ({ row }) => {
      const roles = row.getValue('roles') as Role[]
      return (
        <span className="max-w-[350px] truncate font-medium flex gap-1">
          {roles.includes('COMMON_USER') && <Badge variant={'common'}>Normal</Badge>}{' '}
          {roles.includes('MANAGER') && <Badge variant={'manager'}>Administrador</Badge>}
        </span>
      )
    },
    filterFn: (row, id, value) => {
      const filterValues = (value ?? []) as string[]
      if (!filterValues || filterValues.length === 0) return true
      const roles = (row.getValue(id) ?? []) as string[]
      return roles.some((r) => filterValues.includes(r))
    },
  },
]
