'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar, FilterDef } from './data-table-toolbar'
import { cn } from '../../lib/utils'
import { Tags } from '@/utils/constants/tags'
import { infosModal } from '@/screens/library/infos-modal'
import { Button } from '../ui/button'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { fetcher } from '@/infra/fetcher'
import { toast } from '../ui/use-toast'

export type { ColumnDef }

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  dataFilters: {
    filters: FilterDef[]
    createButton: React.ReactNode
  }
  className?: React.HTMLAttributes<HTMLDivElement>['className']
  type: (typeof Tags)[number]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  dataFilters,
  className,
  type,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

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

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({ tag, id }: { tag: (typeof Tags)[number]; id: number }) => {
      const res = await fetcher(`/api/handlers/${tag}/${id}`, { method: 'DELETE' })

      if (!res.ok) {
        throw new Error('Error deleting item')
      }
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({ queryKey: ['library', params.tag] })
      queryClient.invalidateQueries({ queryKey: ['select-dynamic-options', params.tag] })

      toast({ title: 'Excluído com sucesso' })
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Erro ao excluir' })
    },
  })

  return (
    <div className={cn('space-y-4', className)}>
      {dataFilters && <DataTableToolbar dataFilters={dataFilters} table={table} />}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
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
                  <TableCell className="flex gap-2 justify-end">
                    {infosModal[type]({ method: 'PUT', data: row.original })}
                    {!['objectFormats'].includes(type) && (
                      <Button
                        onClick={() => mutation.mutate({ tag: type, id: (row.original as any).id })}
                        variant="destructive"
                        size="sm"
                      >
                        Excluir
                      </Button>
                    )}
                  </TableCell>
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
