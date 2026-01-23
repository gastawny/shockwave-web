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
import { User, UserSchema } from '@/types/user'
import { z } from 'zod'
import { useUserStore } from '@/infra/stores/user-store-provider'
import { Checkbox } from '@/components/ui/checkbox'

export interface UsersModalProps {
  method: 'PUT' | 'POST'
  data?: User
}

type UserModal = User & {
  password?: string
  manager?: boolean
}

export function UsersModal({ data, method }: UsersModalProps) {
  const { user } = useUserStore()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationKey: ['users', method],
    mutationFn: async (data: UserModal) => {
      const userData = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        isManager: !!data.manager,
      }

      const res = await fetcher('/api/handlers', {
        method,
        body: JSON.stringify({
          type: 'users',
          data: userData,
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
    onError: (e) => {
      console.error(e)
      toast({
        variant: 'destructive',
        title: `Erro ao ${method === 'POST' ? 'criar' : 'editar'} usuário`,
      })
    },
  })

  const userSchema = method === 'POST' ? UserSchema('create') : UserSchema('update')

  const userSchemaModalPost = userSchema.extend({
    password: z
      .string({ required_error: 'A senha é obrigatória' })
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),
    manager: z.boolean().optional(),
  })

  const userSchemaModalUpdate = userSchema.extend({
    password: z
      .string()
      .min(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
      .optional()
      .or(z.literal('')),
    manager: z.boolean().optional(),
  })

  const form = useForm<UserModal>({
    resolver: zodResolver(method === 'POST' ? userSchemaModalPost : userSchemaModalUpdate),
    defaultValues: { ...data, manager: data?.roles?.includes('MANAGER') },
  })

  useEffect(() => {
    form.reset({ ...data, manager: data?.roles?.includes('MANAGER') })
  }, [data, form])

  function handleCancel() {
    form.reset()
    setIsDialogOpen(false)
  }

  function handleOpenChange(open: boolean) {
    if (!open) form.reset()
    setIsDialogOpen(open)
  }

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full lg:w-auto" variant="outline">
          {method === 'POST' && <Plus className="mr-1 h-4 w-4" />}
          {method === 'PUT' ? 'Editar' : 'Criar'}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 lg:w-1/3">
        <DialogHeader>
          <DialogTitle>
            {method === 'PUT'
              ? `Editar usuário | ${data?.firstName} ${data?.lastName}`
              : 'Criar usuário'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="w-full flex flex-col gap-6">
            <div className="grid grid-cols-2 grid-rows-3 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Primeiro Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Último Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.roles?.includes('MANAGER') && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="flex flex-col gap-1">
                          Senha
                          <span className="font-normal text-xs text-muted-foreground">
                            Preencha este campo apenas se desejar alterar a senha deste usuário
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="manager"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="ml-2">Administrador</FormLabel>
                      </FormItem>
                    )}
                  />
                </>
              )}
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
