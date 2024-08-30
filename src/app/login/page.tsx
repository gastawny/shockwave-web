'use client'

import { Login } from '@/screens/Login'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormEvent } from 'react'

const FormSchema = z.object({
  username: z.string().min(3, {
    message: 'O nome de usuário deve ter no mínimo 3 caracteres',
  }),
  password: z.string().min(3, {
    message: 'A senha deve ter no mínimo 3 caracteres',
  }),
})

export default function LoginPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: FormEvent<HTMLFormElement>) {
    console.log(data)
  }

  return (
    <Login.Background className="flex h-screen w-screen p-4">
      <div className="bg-slate-900/45 shadow-xl p-16 w-2/5 2xl:w-1/3 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 rounded-2xl flex justify-center items-center flex-col gap-16">
        <Form {...form}>
          <form onSubmit={onSubmit} className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário</FormLabel>
                    <FormControl>
                      <Input className="border-slate-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" className="border-slate-500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size="lg" className="font-bold uppercase tracking-wider">
              Entrar
            </Button>
          </form>
        </Form>
      </div>
    </Login.Background>
  )
}
