'use client'

import { Tags } from '@/utils/constants/tags'
import { GenericList } from '@/types/generic-list'
import { SelectContent, SelectItem } from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/infra/fetcher'
import { useEffect } from 'react'

interface SelectDynamicOptionsProps {
  tag: (typeof Tags)[number]
  onRefetchingChange?: (value: boolean) => void
}

export function SelectDynamicOptions({ tag, onRefetchingChange }: SelectDynamicOptionsProps) {
  const { data, isRefetching } = useQuery<GenericList[]>({
    queryKey: ['select-dynamic-options', tag],
    queryFn: async () => await fetcher(`/api/handlers/${tag}/find2Select`),
    staleTime: 60 * 1000,
  })

  useEffect(() => {
    onRefetchingChange?.(isRefetching)
  }, [isRefetching, onRefetchingChange])

  return (
    <SelectContent>
      {data?.map((item: GenericList) => (
        <SelectItem key={item.id} value={item.id.toString()}>
          {item.name}
        </SelectItem>
      ))}
    </SelectContent>
  )
}
