'use client'

import { toast } from '@/components/ui/use-toast'
import { http } from '@/infra/http'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { PostExplosionForm } from '../forms/post-explosion-form'
import { PostExplosion } from '@/types/post-explosion'
import { API_URL } from '@/config/variables'
import { cookies } from '@/infra/cookies'

type PostExplosionFormType = PostExplosion & {
  multipartFiles: File[]
}

export function PostExplosionRegister() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  async function onSubmit(data: PostExplosionFormType) {
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

    const res = await fetch(API_URL + '/api/postExplosions', {
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
          ? 'Não foi possível atualizar o pós-explosão'
          : 'Não foi possível criar o pós-explosão',
        variant: 'destructive',
      })

      return
    }

    toast({
      title: 'Sucesso',
      description: id ? 'Pós-explosão atualizado com sucesso' : 'Pós-explosão criado com sucesso',
    })

    const responseData = await res.json()

    if (!id) {
      router.push(`${pathname}?id=${responseData?.id}`)
    }
  }

  return <PostExplosionForm id={id} onSubmit={onSubmit} />
}
