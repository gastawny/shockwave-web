'use client'

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
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { PasswordInput } from '@/components/ui/password-input'
import { useUserStore } from '@/infra/stores/user-store-provider'
import { useMutation } from '@tanstack/react-query'
import { fetcher } from '@/infra/fetcher'
import { useState } from 'react'
import { Token } from '@/types/token'
import { cookies } from '@/infra/cookies'

const FormSchema = z.object({
  email: z.string().email({
    message: 'Email inválido',
  }),
  password: z.string().min(8, {
    message: 'A senha deve ter no mínimo 8 caracteres',
  }),
})

export default function LoginPage() {
  const [errMessage, setErrMessage] = useState('')
  const { setUser } = useUserStore()
  const router = useRouter()
  const mutation = useMutation<Token, Error, z.infer<typeof FormSchema>>({
    mutationFn: async (data) => {
      const res = await fetcher('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(data),
        justReturnResponse: true,
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Erro ao autenticar')
      }

      const json = (await res.json()) as Token
      return json
    },
    onSuccess: async (data) => {
      setUser(data.user)

      cookies.set('at', data.accessToken, {
        expires: data.expiration,
        secure: true,
      })
      cookies.set('rt', data.refreshToken, {
        expires: data.expiration,
        secure: true,
      })
      await cookies.set('e', data.user.email ?? '', {
        expires: data.expiration,
        secure: true,
      })

      router.push('/')
    },
    onError: (e) => {
      setErrMessage('Erro ao fazer login. Verifique suas credenciais e tente novamente.')
    },
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = form.handleSubmit((data) => mutation.mutate(data))

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <Form {...form}>
                <form onSubmit={onSubmit} className="p-6 md:p-8">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">Bem vindo</h1>
                      <p className="text-muted-foreground">
                        Realize o login na sua conta Shockwave
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
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
                            <PasswordInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {errMessage && <p className="text-red-500 text-sm">{errMessage}</p>}
                    <Button type="submit" size="lg" className="font-bold w-full tracking-wider">
                      Entrar
                    </Button>
                  </div>
                </form>
              </Form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="/images/mario.png"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
