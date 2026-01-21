'use client'

import { toast } from '@/components/ui/use-toast'
import { BombThreat } from '@/types/bomb-threat'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { BombThreatForm } from '../forms/bomb-threat-form'
import { http } from '@/infra/http'

export function BombThreatRegister() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  async function onSubmit(data: BombThreat) {
    const res = await http('/api/handlers', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify({
        type: 'bombThreats',
        data: { ...data, objectType: undefined },
      }),
    })

    if (!res.ok) {
      toast({
        title: 'Erro',
        description: id
          ? 'Não foi possível atualizar a ameaça de bomba'
          : 'Não foi possível criar a ameaça de bomba',
        variant: 'destructive',
      })

      return
    }

    toast({
      title: 'Sucesso',
      description: id
        ? 'Ameaça de bomba atualizada com sucesso'
        : 'Ameaça de bomba criada com sucesso',
    })

    if (!id) {
      router.push(`${pathname}?id=${res.data.id}`)
    }
  }

  return <BombThreatForm id={id} onSubmit={onSubmit} />
}
