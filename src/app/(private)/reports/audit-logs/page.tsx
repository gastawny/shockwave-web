'use client'

import { ColumnDef } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetcher } from '@/infra/fetcher'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useState } from 'react'

type AuditLog = {
  id: number
  action: string
  entityType: string
  entityValue: string
  entityId: number
  performedById: number
  performedByName: string
  createdAt: string
}

const actionLabels: Record<string, string> = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  CREATE: 'Criação',
  UPDATE: 'Atualização',
  DELETE: 'Exclusão',
}

const entityTypeLabels: Record<string, string> = {
  users: 'Usuários',
  bombThreats: 'Ameaças de Bomba',
  locatedObjects: 'Objetos Localizados',
  postExplosions: 'Pós-Explosões',
  explosives: 'Explosivos',
  grounds: 'Tipos de Solo',
  objectFormats: 'Formatos de Objeto',
  formThreats: 'Formas de Ameaça',
  pops: 'POPs',
}

function translateAction(action: string) {
  return actionLabels[action] ?? action
}

function translateEntityType(entityType: string) {
  return entityTypeLabels[entityType] ?? entityType
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} ${hour}:${minute}`
}

const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: 'action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ação" />,
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate font-medium">{translateAction(row.getValue('action'))}</span>
    ),
    footer: 'Ação',
    filterFn: (row, id, value) => {
      const cell = translateAction(String(row.getValue(id) ?? ''))
      const filter = String(value ?? '')
      return cell.toLowerCase().includes(filter.toLowerCase())
    },
  },
  {
    accessorKey: 'entityType',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Entidade" />,
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate font-medium">{translateEntityType(row.getValue('entityType'))}</span>
    ),
    filterFn: (row, id, value) => {
      const cell = translateEntityType(String(row.getValue(id) ?? ''))
      const filter = String(value ?? '')
      return cell.toLowerCase().includes(filter.toLowerCase())
    },
  },
  {
    accessorKey: 'entityValue',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Valor" />,
    cell: ({ row }) => (
      <span className="max-w-[250px] truncate font-medium">{row.getValue('entityValue')}</span>
    ),
    filterFn: (row, id, value) => {
      const cell = String(row.getValue(id) ?? '')
      const filter = String(value ?? '')
      return cell.toLowerCase().includes(filter.toLowerCase())
    },
  },
  {
    accessorKey: 'performedByName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Realizado por" />,
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate font-medium">{row.getValue('performedByName')}</span>
    ),
    filterFn: (row, id, value) => {
      const cell = String(row.getValue(id) ?? '')
      const filter = String(value ?? '')
      return cell.toLowerCase().includes(filter.toLowerCase())
    },
  },
  {
    id: 'createdAt',
    accessorFn: (row) => formatDate(row.createdAt),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Data/Hora" />,
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate font-medium">{row.getValue('createdAt')}</span>
    ),
    filterFn: (row, id, value) => {
      const cell = String(row.getValue(id) ?? '')
      const filter = String(value ?? '')
      return cell.toLowerCase().includes(filter.toLowerCase())
    },
  },
]

export default function AuditLogsPage() {
  const { data } = useSuspenseQuery<AuditLog[]>({
    queryKey: ['reports', 'auditLogs'],
    queryFn: async () => {
      const result: AuditLog[] = await fetcher('/api/auditLogs', { justReturnResponse: false })
      return result.filter((log) => log.performedById !== 1)
    },
  })

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar dataFilters={{}} table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
