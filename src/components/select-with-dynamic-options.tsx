'use client'

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { FormControl } from '@/components/ui/form'
import { useQuery } from '@tanstack/react-query'
import { fetcher } from '@/infra/fetcher'
import { GenericList } from '@/types/generic-list'
import { Tags } from '@/utils/constants/tags'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'

interface SelectWithDynamicOptionsProps {
  tag: (typeof Tags)[number]
  value?: string
  onValueChange: (value: string) => void
  placeholder: string
  disabled?: boolean
  onRefetchingChange?: (value: boolean) => void
}

export function SelectWithDynamicOptions({
  tag,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  onRefetchingChange,
}: SelectWithDynamicOptionsProps) {
  const {
    data: options,
    isLoading,
    isError,
    isRefetching,
  } = useQuery<GenericList[]>({
    queryKey: ['select-dynamic-options', tag],
    queryFn: async () => await fetcher(`/api/handlers/${tag}/find2Select`),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    onRefetchingChange?.(isRefetching)
  }, [isRefetching, onRefetchingChange])

  useEffect(() => {
    if (options && !isLoading) {
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [options, isLoading])

  if (isError) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Erro ao carregar opções" />
        </SelectTrigger>
      </Select>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  const selectedOption = options?.find((option) => option.id.toString() === value)

  return (
    <Select onValueChange={onValueChange} value={value || ''} disabled={disabled}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder}>{selectedOption?.name}</SelectValue>
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options?.map((item: GenericList) => (
          <SelectItem key={item.id} value={item.id.toString()}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
