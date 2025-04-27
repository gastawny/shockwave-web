'use client'

import { Login } from '@/screens/Login'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { onSubmit } from '@/app/login/action'
import { redirect } from 'next/navigation'

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

  const action: () => void = form.handleSubmit(async (data) => {
    // await onSubmit(data)

    redirect('/app')
  })

  return (
    <Login.Background className="flex h-screen w-screen p-4">
      <div className="bg-background/25 shadow-xl p-8 lg:p-16 w-11/12 lg:w-2/5 2xl:w-1/3 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 rounded-2xl flex justify-center items-center flex-col gap-16">
        <Form {...form}>
          <form action={action} className="w-full flex flex-col gap-8">
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
