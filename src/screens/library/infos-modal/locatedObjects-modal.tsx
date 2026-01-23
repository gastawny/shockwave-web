'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { LocatedObject } from '@/types/located-object'
import Link from 'next/link'

export interface LocatedObjectModalProps {
  method: 'PUT' | 'POST'
  data?: LocatedObject
}

export function LocatedObjectsModal({ data, method }: LocatedObjectModalProps) {
  return (
    <Button className="w-full lg:w-auto" variant="outline" asChild>
      <Link
        href={
          method === 'POST'
            ? '/new-event/located-object'
            : `/new-event/located-object?id=${data?.id}`
        }
      >
        {method === 'POST' && <Plus className="h-4 w-4" />}
        {method === 'PUT' ? 'Editar' : 'Criar'}
      </Link>
    </Button>
  )
}
