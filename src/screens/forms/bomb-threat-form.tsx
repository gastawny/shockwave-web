'use client'

import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { BombThreat, BombThreatSchema } from '@/types/bomb-threat'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { http } from '@/infra/http'
import { toast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import LocatedObjectForm from './located-object-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LocatedObject } from '@/types/located-object'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher } from '@/infra/fetcher'
import { useLoading } from '@/infra/providers/loading-provider'
import { Input } from '@/components/ui/input'
import { SelectWithDynamicOptions } from '@/components/select-with-dynamic-options'
import { ScrollArea } from '@/components/ui/scroll-area'

type BombThreatFormProps = {
  id?: string | null
  onSubmit: (data: BombThreat) => void
}

export function BombThreatForm({ id, onSubmit }: BombThreatFormProps) {
  const { loading } = useLoading()

  const [isRefetchingObjectLocated, setIsRefetchingObjectLocated] = useState(false)
  const [modalObjectLocated, setModalObjectLocated] = useState({
    open: false,
    id: null as string | null,
  })

  const queryClient = useQueryClient()

  const mutationLocatedObject = useMutation({
    mutationFn: async (data: LocatedObject) =>
      await fetcher('/api/handlers', {
        method: data.id ? 'PUT' : 'POST',
        body: JSON.stringify({
          type: 'locatedObjects',
          data,
        }),
      }),
    onSuccess: onSuccessSubmitLocatedObject,
  })

  const bombThreatSchema = BombThreatSchema(id ? 'update' : 'create')

  const form = useForm<BombThreat>({
    resolver: zodResolver(bombThreatSchema),
    defaultValues: {
      formThreat: undefined,
      locatedObject: null,
      name: '',
      objectNotFoundDescription: '',
      formThreatDescription: '',
      objectType: 'not_located',
    },
  })

  const locatedObjectId = form.watch('locatedObject.id')

  useEffect(() => {
    ;(async () => {
      if (!id) return

      const res = await http(`/api/handlers/bombThreats/${id}`)

      if (res.ok) {
        form.setValue('id', res.data.id)
        form.setValue('name', res.data.name)
        form.setValue('formThreat', res.data.formThreat)
        form.setValue('formThreatDescription', res.data.formThreatDescription)
        form.setValue('objectType', res.data.objectType)
        form.setValue('locatedObject', res.data.locatedObject)
        form.setValue('objectNotFoundDescription', res.data.objectNotFoundDescription)

        if (res.data.locatedObject === null) {
          form.setValue('objectType', 'not_located')
        } else {
          form.setValue('objectType', 'located_object')
        }
      }
    })()
  }, [id])

  async function onSuccessSubmitLocatedObject(data: any, variables: LocatedObject) {
    await queryClient.refetchQueries({
      queryKey: ['select-dynamic-options', 'locatedObjects'],
    })

    await new Promise((resolve) => setTimeout(resolve, 50))

    form.setValue('locatedObject', data)

    setModalObjectLocated((prev) => ({ ...prev, open: false }))

    toast({
      title: 'Sucesso',
      description: variables.id
        ? 'Objeto localizado atualizado com sucesso'
        : 'Objeto localizado criado com sucesso',
    })
  }

  function handleChangeTabs(value: string) {
    form.setValue('objectType', value as 'located_object' | 'not_located')

    form.setValue('locatedObject', null)
    form.setValue('objectNotFoundDescription', null)
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="full grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identificação</FormLabel>
                <Input placeholder="Identificação da ameaça de bomba" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="formThreat.id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forma de Ameaça</FormLabel>
                <SelectWithDynamicOptions
                  tag="formThreats"
                  value={field.value?.toString()}
                  onValueChange={field.onChange}
                  placeholder="Selecione a Forma de Ameaça"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="formThreatDescription"
            render={({ field }) => (
              <FormItem className="lg:col-span-2">
                <FormLabel>Observações da Forma de Ameaça</FormLabel>
                <Textarea {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className="my-2 lg:col-span-2" />

          <Tabs
            value={form.watch().objectType}
            onValueChange={handleChangeTabs}
            defaultValue="not_located"
            className="lg:col-span-2"
          >
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="not_located">Objeto Não Localizado</TabsTrigger>
              <TabsTrigger value="located_object">Objeto Localizado</TabsTrigger>
            </TabsList>

            <TabsContent value="not_located">
              <FormField
                control={form.control}
                name="objectNotFoundDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descreva o máximo possível sobre a ocorrência</FormLabel>
                    <Textarea {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent
              value="located_object"
              className="grid grid-cols-3 lg:grid-cols-6 gap-x-2 gap-y-4 items-end"
            >
              <FormField
                control={form.control}
                name="locatedObject.id"
                render={({ field }) => (
                  <FormItem
                    className={`${
                      locatedObjectId ? 'col-span-2 lg:col-span-4' : 'col-span-3 lg:col-span-5'
                    } w-full`}
                  >
                    <FormLabel>Objeto Localizado</FormLabel>
                    <SelectWithDynamicOptions
                      tag="locatedObjects"
                      value={field.value?.toString()}
                      onValueChange={field.onChange}
                      placeholder="Selecione o Objeto Localizado"
                      onRefetchingChange={setIsRefetchingObjectLocated}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {locatedObjectId && (
                <Button
                  type="button"
                  disabled={loading}
                  className="w-full lg:w-auto"
                  variant="secondary"
                  onClick={() =>
                    setModalObjectLocated({
                      open: true,
                      id: locatedObjectId!.toString(),
                    })
                  }
                >
                  Atualizar
                </Button>
              )}

              <Button
                disabled={loading}
                type="button"
                className="col-span-3 lg:col-span-1 w-full lg:w-auto"
                variant="secondary"
                onClick={() =>
                  setModalObjectLocated({
                    open: true,
                    id: null,
                  })
                }
              >
                Criar
              </Button>
            </TabsContent>
          </Tabs>

          <Separator className="my-2 lg:col-span-2" />

          <Button
            disabled={loading || isRefetchingObjectLocated}
            type="submit"
            className="w-full lg:col-span-2"
          >
            {id ? 'Atualizar' : 'Criar'} Ameaça de Bomba
          </Button>
        </form>
      </Form>

      <Dialog
        open={modalObjectLocated.open}
        onOpenChange={(open) => setModalObjectLocated((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="w-11/12">
          <ScrollArea className="h-[80vh]">
            <DialogHeader>
              <DialogTitle>
                {modalObjectLocated.id ? 'Atualizar' : 'Novo'} Objeto Localizado
              </DialogTitle>
              <DialogDescription>
                {modalObjectLocated.id
                  ? 'Atualize os dados do objeto localizado'
                  : 'Preencha os dados para criar um novo objeto localizado'}
              </DialogDescription>
            </DialogHeader>
            <LocatedObjectForm id={modalObjectLocated.id} onSubmit={mutationLocatedObject.mutate} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
