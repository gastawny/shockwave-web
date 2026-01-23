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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher } from '@/infra/fetcher'
import { FormThreat, FormThreatSchema } from '@/types/form-threat'

export interface FormThreatsModalProps {
  method: 'PUT' | 'POST'
  data?: FormThreat
}

export function FormThreatsModal({ data, method }: FormThreatsModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationKey: ['formThreats', method],
    mutationFn: async (data: FormThreat) => {
      const res = await fetcher('/api/handlers', {
        method,
        body: JSON.stringify({
          type: 'formThreats',
          data,
        }),
      })

      if (!res.ok) throw new Error('Error in mutation')

      return res
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['library', 'users'] })
      queryClient.refetchQueries({ queryKey: ['select-dynamic-options', 'users'] })
      form.reset()
      setIsDialogOpen(false)
      toast({ title: `Usuário ${method === 'POST' ? 'criado' : 'atualizado'} com sucesso` })
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: `Erro ao ${method === 'POST' ? 'criar' : 'editar'} forma de ameaça`,
      })
    },
  })

  const formThreatSchema =
    method === 'POST' ? FormThreatSchema('create') : FormThreatSchema('update')

  const form = useForm<FormThreat>({
    resolver: zodResolver(formThreatSchema),
    defaultValues: data,
  })

  useEffect(() => {
    form.reset(data)
  }, [data, form])

  function handleCancel() {
    form.reset()
    setIsDialogOpen(false)
  }

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full lg:w-auto" variant="outline">
          {method === 'POST' && <Plus className="h-4 w-4" />}
          {method === 'PUT' ? 'Editar' : 'Criar'}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 h-auto">
        <DialogHeader>
          <DialogTitle>
            {method === 'PUT' ? `Editar forma de ameaça | ${data?.name}` : 'Criar forma de ameaça'}
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
