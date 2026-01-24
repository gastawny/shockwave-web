'use client'

import { toast } from '@/components/ui/use-toast'
import { BombThreat } from '@/types/bomb-threat'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { BombThreatForm } from '../forms/bomb-threat-form'
import { API_URL } from '@/config/variables'
import { cookies } from '@/infra/cookies'

type BombThreatFormType = BombThreat & {
  multipartFiles: File[]
}

export function BombThreatRegister() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  async function onSubmit(data: BombThreatFormType) {
    const formData = new FormData()

    data.multipartFiles.forEach((file) => {
      formData.append('multipartFiles', file)
    })

    formData.append(
      'data',
      JSON.stringify({
        ...data,
        multipartFiles: undefined,
        objectType: undefined,
        files: undefined,
      })
    )

    const res = await fetch(API_URL + '/api/bombThreats', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${(await cookies.get('at')) || ''}`,
      },
      body: formData,
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

    const responseData = await res.json()

    if (!id) {
      router.push(`${pathname}?id=${responseData?.id}`)
    }
  }

  return <BombThreatForm id={id} onSubmit={onSubmit} />
}
