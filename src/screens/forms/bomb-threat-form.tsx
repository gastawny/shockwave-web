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
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { fetcher } from '@/infra/fetcher'
import { useLoading } from '@/infra/providers/loading-provider'
import { Input } from '@/components/ui/input'
import { SelectWithDynamicOptions } from '@/components/select-with-dynamic-options'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneImagePreview,
  DropzoneTrigger,
  useDropzone,
} from '@/components/ui/dropzone'
import { CloudUploadIcon, Trash2Icon } from 'lucide-react'

type BombThreatFormProps = {
  id?: string | null
  onSubmit: (data: BombThreat & { multipartFiles: File[] }) => void
}

function generateKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function BombThreatForm({ id, onSubmit }: BombThreatFormProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['bomb-threat', id],
    queryFn: async ({ queryKey }) => {
      const [, idParam] = queryKey
      if (!idParam) return null
      return await fetcher(`/api/handlers/bombThreats/${idParam}`, { justReturnResponse: false })
    },
    refetchOnMount: true,
  })
  const { loading } = useLoading()
  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return {
        status: 'success',
        result: URL.createObjectURL(file),
      }
    },
    validation: {
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg'],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 10,
    },
  })

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
      files: [],
    },
  })

  const locatedObjectId = form.watch('locatedObject.id')

  function base64ToFile(base64: string, filename: string, mime = 'image/jpeg') {
    const binary = atob(base64.replace(/^data:.*;base64,/, ''))
    const len = binary.length
    const buffer = new Uint8Array(len)
    for (let i = 0; i < len; i++) buffer[i] = binary.charCodeAt(i)
    const blob = new Blob([buffer], { type: mime })
    return new File([blob], filename, { type: mime })
  }

  async function setBombThreatFormValues(data: BombThreat) {
    form.setValue('id', data?.id)
    form.setValue('name', data?.name)
    form.setValue('formThreat', data?.formThreat)
    form.setValue('formThreatDescription', data?.formThreatDescription)
    form.setValue('objectType', data?.objectType)
    form.setValue('locatedObject', data?.locatedObject)
    form.setValue('objectNotFoundDescription', data.objectNotFoundDescription)
    form.setValue('files', data.files)

    if (Array.isArray(data.files) && data.files.length) {
      const items = data.files.map((f: any) => {
        const file = base64ToFile(f.data, f.name ?? `image-${f.id}`, 'image/jpeg')
        const dataUrl = `data:image/jpeg;base64,${f.data}`
        return {
          id: String(f.id),
          fileName: f.name ?? `image-${f.id}`,
          file,
          result: dataUrl,
        }
      })
      await dropzone.hydrateFiles(items)
    }

    if (data.locatedObject === null) {
      form.setValue('objectType', 'not_located')
    } else {
      form.setValue('objectType', 'located_object')
    }
  }

  useEffect(() => {
    if (!data) return

    setBombThreatFormValues(data)
  }, [data])

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

  async function submit(data: BombThreat) {
    const multipartFiles = dropzone.fileStatuses.map((f) => f.file).filter(Boolean)

    onSubmit({ ...data, multipartFiles })
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit)}
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

          <div className="not-prose flex flex-col gap-4 lg:col-span-2">
            <Dropzone {...dropzone}>
              <div>
                <div className="flex justify-between">
                  <DropzoneDescription>Selecione até 10 imagens</DropzoneDescription>
                  <DropzoneMessage />
                </div>
                <DropZoneArea>
                  <DropzoneTrigger className="flex flex-col items-center gap-4 bg-transparent p-10 text-center text-sm">
                    <CloudUploadIcon className="size-8" />
                    <div>
                      <p className="font-semibold">Selecione ou arraste e solte</p>
                      <p className="text-sm text-muted-foreground">
                        Clique aqui ou arraste e solte para fazer upload
                      </p>
                    </div>
                  </DropzoneTrigger>
                </DropZoneArea>
              </div>

              <DropzoneFileList className="grid grid-cols-3 gap-3 p-0">
                {dropzone.fileStatuses.map((file) => (
                  <DropzoneFileListItem
                    className="overflow-hidden rounded-md bg-secondary p-0 shadow-sm"
                    key={generateKey()}
                    file={file}
                  >
                    {file.status === 'pending' && (
                      <div className="aspect-video animate-pulse bg-black/20" />
                    )}
                    {file.status === 'success' && (
                      <DropzoneImagePreview file={file} imgClassName="aspect-video object-cover" />
                    )}
                    <div className="flex items-center justify-between p-2 pl-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm">{file.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <DropzoneRemoveFile variant="ghost" className="shrink-0 hover:outline">
                        <Trash2Icon className="size-4" />
                      </DropzoneRemoveFile>
                    </div>
                  </DropzoneFileListItem>
                ))}
              </DropzoneFileList>
            </Dropzone>
          </div>
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
