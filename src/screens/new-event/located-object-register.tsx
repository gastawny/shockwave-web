import { toast } from '@/components/ui/use-toast'
import { http } from '@/infra/http'
import { LocatedObject } from '@/types/located-object'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import LocatedObjectForm from './located-object-form'

export function LocatedObjectRegister() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  async function onSubmit(data: LocatedObject) {
    const res = await http('/api/handlers', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify({
        type: 'locatedObjects',
        data,
      }),
    })

    if (!res.ok) {
      toast({
        title: 'Erro',
        description: id
          ? 'Não foi possível atualizar o objeto localizado'
          : 'Não foi possível criar o objeto localizado',
        variant: 'destructive',
      })

      return
    }

    toast({
      title: 'Sucesso',
      description: id
        ? 'Objeto localizado atualizado com sucesso'
        : 'Objeto localizado criado com sucesso',
    })

    if (!id) {
      router.push(`${pathname}?id=${res.data.id}`)
    }
  }

  return <LocatedObjectForm id={id} onSubmit={onSubmit} />
}
