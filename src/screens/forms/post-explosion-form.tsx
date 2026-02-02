'use client'

import { CircleConfig, GeoLocation, Maps } from '@/components/maps'
import { Button } from '@/components/ui/button'
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneImagePreview,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneTrigger,
  useDropzone,
} from '@/components/ui/dropzone'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { fetcher } from '@/infra/fetcher'
import { PostExplosion, PostExplosionSchema } from '@/types/post-explosion'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { CloudUploadIcon, Trash2Icon } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { json } from 'stream/consumers'

interface PostExplosionFormProps {
  id?: string | null
  onSubmit: (data: PostExplosion & { multipartFiles: File[] }) => Promise<void>
}

function generateKey() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function PostExplosionForm({ id, onSubmit }: PostExplosionFormProps) {
  const queryClient = useQueryClient()

  const { data } = useSuspenseQuery({
    queryKey: ['post-explosion', id],
    queryFn: async ({ queryKey }) => {
      const [, idParam] = queryKey
      if (!idParam) return null
      return await fetcher(`/api/handlers/postExplosions/${idParam}`, { justReturnResponse: false })
    },
    refetchOnMount: true,
  })

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

  const postExplosionSchema = PostExplosionSchema(id ? 'update' : 'create')

  const form = useForm<PostExplosion>({
    resolver: zodResolver(postExplosionSchema),
    defaultValues: {
      name: '',
      latitude: undefined,
      longitude: undefined,
      description: '',
      vestigeDistance: undefined,
      files: [],
    },
  })

  const latitude = useWatch({ control: form.control, name: 'latitude' })
  const longitude = useWatch({ control: form.control, name: 'longitude' })
  const vestigeDistance = useWatch({ control: form.control, name: 'vestigeDistance' })

  const { data: circles } = useSuspenseQuery<{ name: string; radius: number; color: string }[]>({
    queryKey: ['post-explosion-circles', id],
    queryFn: async ({ queryKey }) => {
      if (!vestigeDistance) return []

      return await fetcher(`/api/postExplosions/getCircles/${vestigeDistance}`, {
        justReturnResponse: false,
      })
    },
  })

  async function refetchCircles() {
    queryClient.refetchQueries({ queryKey: ['post-explosion-circles', id] })
  }

  const circlesConfigured = useMemo(() => {
    if (!vestigeDistance || !circles) return []
    const lat = latitude || 0
    const lng = longitude || 0
    return circles.map((circle) => ({
      label: circle.name,
      center: { lat, lng },
      radius: circle.radius,
      fillColor: circle.color,
      strokeColor: circle.color,
      strokeWeight: 2,
      fillOpacity: 0.2,
    }))
  }, [circles, latitude, longitude, vestigeDistance])

  const latError = form.formState.errors.latitude

  function base64ToFile(base64: string, filename: string, mime = 'image/jpeg') {
    const binary = atob(base64.replace(/^data:.*;base64,/, ''))
    const len = binary.length
    const buffer = new Uint8Array(len)
    for (let i = 0; i < len; i++) buffer[i] = binary.charCodeAt(i)
    const blob = new Blob([buffer], { type: mime })
    return new File([blob], filename, { type: mime })
  }

  async function setPostExplosionFormValues(data: PostExplosion) {
    form.setValue('id', data?.id)
    form.setValue('name', data?.name)
    form.setValue('latitude', data?.latitude)
    form.setValue('longitude', data?.longitude)
    form.setValue('description', data?.description)
    form.setValue('vestigeDistance', data?.vestigeDistance)
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
  }

  async function handleMarker(event: GeoLocation) {
    form.setValue('latitude', event.lat)
    form.setValue('longitude', event.lng)
    await refetchCircles()
  }

  useEffect(() => {
    if (!data) return

    setPostExplosionFormValues(data)
  }, [data])

  console.log(form.formState.errors)

  async function submit(data: PostExplosion) {
    const multipartFiles = dropzone.fileStatuses.map((f) => f.file).filter(Boolean)

    onSubmit({ ...data, multipartFiles })
  }

  return (
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
              <Input placeholder="Identificação do objeto localizado" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vestigeDistance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distância do vestígio</FormLabel>
              <Input placeholder="Distância do vestígio" {...field} onBlur={refetchCircles} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Descrição</FormLabel>
              <Textarea placeholder="Descrição" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="lg:col-span-2" />

        {latError && (
          <p className="text-[0.8rem] font-medium text-destructive">Marque a localização no mapa</p>
        )}
        <div className="rounded-md bg-primary/10 h-96 w-full lg:col-span-2">
          <Maps
            onMarkerChange={(e) => handleMarker(e)}
            markers={[
              {
                lat: form.getValues('latitude') || 0,
                lng: form.getValues('longitude') || 0,
              },
            ]}
            circles={circlesConfigured}
          />
        </div>

        <Separator className="lg:col-span-2" />

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

        <Separator className="lg:col-span-2" />

        <Button type="submit" className="lg:col-span-2">
          {id ? 'Atualizar Objeto Localizado' : 'Criar Objeto Localizado'}
        </Button>
      </form>
    </Form>
  )
}
