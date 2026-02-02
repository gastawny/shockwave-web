'use client'

import { User as UserIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from './ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { useForm } from 'react-hook-form'
import { User, UserSchema } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUserStore } from '@/infra/stores/user-store-provider'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher } from '@/infra/fetcher'
import { Form, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { z } from 'zod'
import { Input } from './ui/input'
import { PasswordInput } from './ui/password-input'
import { toast } from './ui/use-toast'
import { useEffect, useState } from 'react'

export function HeaderUserEdit() {
  const [open, setOpen] = useState(false)
  const { user, setUser } = useUserStore()

  type UserFormType = z.infer<typeof userFormSchema>

  const mutation = useMutation({
    mutationFn: async (data: UserFormType) =>
      await fetcher('/api/handlers', {
        method: data.id ? 'PUT' : 'POST',
        body: JSON.stringify({
          type: 'users',
          data: {
            ...data,
            password: data?.password || null,
            confirmPassword: undefined,
            isManager: user?.roles?.includes('MANAGER') ?? false,
          },
        }),
        justReturnResponse: true,
      }),
    onSuccess: (data) => {
      setUser({ ...user, ...data })
      toast({
        title: 'Sucesso',
        description: 'Usuário atualizado com sucesso.',
      })

      setOpen(false)
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao atualizar o usuário.',
        variant: 'destructive',
      })
    },
  })

  useEffect(() => {
    form.setValue('id', user?.id ?? undefined)
    form.setValue('firstName', user?.firstName || '')
    form.setValue('lastName', user?.lastName || '')
    form.setValue('email', user?.email || '')
  }, [user])

  const userSchema = UserSchema('update')

  const userFormSchema = userSchema
    .extend({
      password: z
        .string()
        .min(8, {
          message: 'A senha deve ter no mínimo 8 caracteres',
        })
        .or(z.literal('')),
      confirmPassword: z
        .string()
        .min(8, {
          message: 'A confirmação de senha deve ter no mínimo 8 caracteres',
        })
        .or(z.literal('')),
    })
    .refine(
      (data) => {
        if (data.password || data.confirmPassword) {
          return data.password === data.confirmPassword
        }
        return true
      },
      {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
      }
    )

  const form = useForm<UserFormType>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      id: user?.id ?? undefined,
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
    },
  })

  function handleCancel() {
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
              <UserIcon />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Editar usuário</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="w-11/12">
        <DialogHeader>
          <h3 className="text-lg font-medium">Editar usuário</h3>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="full grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <Input placeholder="Primeiro nome" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobrenome</FormLabel>
                  <Input placeholder="Sobrenome" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="Email" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel className="flex flex-col gap-1">
                    Senha
                    <span className="font-normal text-xs text-muted-foreground">
                      Preencha este campo apenas se desejar alterar a senha deste usuário
                    </span>
                  </FormLabel>

                  <PasswordInput autoComplete="new-password" placeholder="Senha" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel>Confirme a senha</FormLabel>
                  <PasswordInput placeholder="Confirme a senha" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="lg:col-span-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
