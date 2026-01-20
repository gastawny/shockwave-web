'use client'

import * as React from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { GenericList } from '@/types/generic-list'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/infra/fetcher'
import { Tags } from '@/utils/constants/tags'

interface SelectResponsiveProps {
  onChange?: (value: string | null) => void
  value: string | null
  className?: React.HTMLAttributes<HTMLDivElement>['className']
  placeholder?: string
  tag: (typeof Tags)[number]
  onRefetchingChange?: (value: boolean) => void
}

// Trabalhar para

export function SelectResponsive({
  onChange,
  value,
  className,
  placeholder,
  tag,
  onRefetchingChange,
}: SelectResponsiveProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedStatus, setSelectedStatus] = React.useState<GenericList | null>(null)

  const { data, isRefetching } = useQuery({
    queryKey: ['select-dynamic-options', tag],
    queryFn: async () => await fetcher<GenericList[]>(`/api/handlers/${tag}`),
    staleTime: 60 * 1000,
  })

  React.useEffect(() => {
    onRefetchingChange?.(isRefetching)
  }, [isRefetching, onRefetchingChange])

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={className}>
            {selectedStatus ? (
              <span>{selectedStatus.name}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList setOpen={setOpen} setSelected={setSelectedStatus} data={data} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedStatus ? (
            <span>{selectedStatus.name}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} setSelected={setSelectedStatus} data={data} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function StatusList({
  setOpen,
  setSelected,
  data,
}: {
  setOpen: (open: boolean) => void
  setSelected: (value: GenericList | null) => void
  data: GenericList[] | undefined
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {data?.map((obj) => (
            <CommandItem
              key={obj.id}
              value={obj.name}
              onSelect={(value) => {
                setSelected(data.find((item) => item.name === value) || null)
                setOpen(false)
              }}
            >
              {obj.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
