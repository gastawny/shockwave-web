'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { PostExplosion } from '@/types/post-explosion'
import Link from 'next/link'

export interface PostExplosionModalProps {
  method: 'PUT' | 'POST'
  data?: PostExplosion
}

export function PostExplosionsModal({ data, method }: PostExplosionModalProps) {
  return (
    <Button className="w-full lg:w-auto" variant="outline" asChild>
      <Link
        href={
          method === 'POST'
            ? '/new-event/post-explosion'
            : `/new-event/post-explosion?id=${data?.id}`
        }
      >
        {method === 'POST' && <Plus className="h-4 w-4" />}
        {method === 'PUT' ? 'Editar' : 'Criar'}
      </Link>
    </Button>
  )
}
