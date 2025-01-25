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

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  dataFilters: {
    principalColumn: {
      key: keyof TData
      title: string
    }
    filters: FilterDef[]
    createButton: React.ReactNode
  }
}

export function DataTableToolbar<TData>({ table, dataFilters }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Filtrar por ${dataFilters.principalColumn.title}`}
          value={
            (table
              .getColumn(dataFilters.principalColumn.key.toString())
              ?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table
              .getColumn(dataFilters.principalColumn.key.toString())
              ?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {dataFilters.filters.map(
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
            className="h-8 px-2 lg:px-3"
          >
            Resetar
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions createButton={dataFilters.createButton} table={table} />
    </div>
  )
}
