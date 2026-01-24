'use client'

import * as React from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { DataTableViewOptions } from './data-table-view-options'

import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { ForwardRefExoticComponent, RefAttributes } from 'react'
import { IconProps } from '@radix-ui/react-icons/dist/types'

export interface FilterDef {
  column: string
  title: string
  options: {
    value: string
    label: string
    icon?: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
  }[]
}

interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>
  dataFilters: {
    filters?: FilterDef[]
    createButton?: React.ReactNode
  }
}

export function DataTableToolbar<TData, TValue>({
  table,
  dataFilters: { filters = [], createButton },
}: DataTableToolbarProps<TData, TValue>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const principalColumn = table.getAllColumns()[0]

  return (
    <div className="flex items-center justify-between flex-col-reverse lg:flex-row gap-4">
      <div className="flex flex-1 items-center space-x-2 w-full">
        <Input
          placeholder={`Filtrar por ${principalColumn.columnDef.footer}`}
          onChange={(event) =>
            table.getColumn(principalColumn.id)?.setFilterValue(event.target.value)
          }
          className="w-full lg:w-[250px]"
        />
        {filters.map(
          ({ column, title, options }) =>
            table.getColumn(column) && (
              <DataTableFacetedFilter
                key={column}
                column={table.getColumn(column)}
                title={title}
                options={options}
              />
            )
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="px-2 lg:px-3"
          >
            Resetar
            <Cross2Icon className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
      {createButton && <DataTableViewOptions createButton={createButton} table={table} />}
    </div>
  )
}
