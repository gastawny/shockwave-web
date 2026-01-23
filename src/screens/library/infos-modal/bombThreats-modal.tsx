'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { BombThreat } from '@/types/bomb-threat'

export interface BombThreatsModalProps {
  method: 'PUT' | 'POST'
  data?: BombThreat
}

export function BombThreatsModal({ data, method }: BombThreatsModalProps) {
  const router = useRouter()

  function handleClick() {
    if (method === 'POST') {
      router.push('/new-event/bomb-threat')
    }
    if (method === 'PUT' && data) {
      router.push(`/new-event/bomb-threat?id=${data.id}`)
    }
  }

  return (
    <Button onClick={handleClick} className="w-full lg:w-auto" variant="outline">
      {method === 'POST' && <Plus className="h-4 w-4" />}
      {method === 'PUT' ? 'Editar' : 'Criar'}
    </Button>
  )
}
