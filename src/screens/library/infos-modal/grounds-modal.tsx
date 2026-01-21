'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import { Plus } from 'lucide-react'
import { Ground, GroundSchema } from '@/types/ground'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher } from '@/infra/fetcher'

export interface GroundsModalProps {
  method: 'PUT' | 'POST'
  ground?: Ground
}

export function GroundsModal({ ground, method }: GroundsModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationKey: ['grounds', method],
    mutationFn: async (data: Ground) => {
      const res = await fetcher('/api/handlers', {
        method,
        body: JSON.stringify({
          type: 'grounds',
          data,
        }),
      })

      if (!res.ok) throw new Error('Error in mutation')

      form.reset()
      setIsDialogOpen(false)
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['library', 'grounds'] })
      toast({ title: `Solo ${method === 'POST' ? 'criado' : 'atualizado'} com sucesso` })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: `Erro ao ${method === 'POST' ? 'criar' : 'editar'} solo`,
      })
    },
  })

  const groundSchema = method === 'POST' ? GroundSchema('create') : GroundSchema('update')

  const form = useForm<Ground>({
    resolver: zodResolver(groundSchema),
    defaultValues: ground,
  })

  useEffect(() => {
    form.reset(ground)
  }, [ground, form])

  function handleCancel() {
    form.reset()
    setIsDialogOpen(false)
  }

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className={method === 'POST' ? 'hidden h-8 lg:flex ml-2' : ''}
          size="sm"
          variant="outline"
        >
          {method === 'POST' && <Plus className="mr-1 h-4 w-4" />}
          {method === 'PUT' ? 'Editar' : 'Criar'}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[40rem] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {method === 'PUT' ? `Editar  solo | ${ground?.name}` : 'Criar solo'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="w-full flex flex-col gap-6">
            <div className="grid grid-cols-2 grid-rows-3 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="k"
                render={({ field }) => (
                  <FormItem className="row-start-2 col-span-2">
                    <FormLabel>k</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {method === 'PUT' ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
