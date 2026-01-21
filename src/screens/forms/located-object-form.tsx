'use client'

import { Maps, GeoLocation } from '@/components/maps'
import { SelectWithDynamicOptions } from '@/components/select-with-dynamic-options'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { http } from '@/infra/http'
import { LocatedObjectSchema, LocatedObject } from '@/types/located-object'
import { ObjectFormatParameter } from '@/types/object-format-parameter'
import { zodResolver } from '@hookform/resolvers/zod'
import { Divide } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

type LocatedObjectFormProps = {
  id?: string | null
  onSubmit: (data: LocatedObject) => void
}

export default function LocatedObjectForm({ id, onSubmit }: LocatedObjectFormProps) {
  const locatedObjectSchema = LocatedObjectSchema(id ? 'update' : 'create')

  const form = useForm<LocatedObject>({
    resolver: zodResolver(locatedObjectSchema),
    defaultValues: {
      name: '',
      latitude: undefined,
      longitude: undefined,
      explosive: undefined,
      ground: undefined,
      objectFormat: undefined,
      objectFormatParameterValues: [],
    },
  })

  const { fields: objectFormatParameterValuesFields, replace } = useFieldArray({
    control: form.control,
    name: 'objectFormatParameterValues',
  })

  const latError = form.formState.errors.latitude

  useEffect(() => {
    ;(async () => {
      if (!id) return

      const res = await http(`/api/handlers/locatedObjects/${id}`)

      if (res.ok) {
        form.setValue('id', res.data.id)
        form.setValue('name', res.data.name)
        form.setValue('explosive', res.data.explosive)
        form.setValue('ground', res.data.ground)
        form.setValue('objectFormat', res.data.objectFormat)
        form.setValue('latitude', res.data.latitude)
        form.setValue('longitude', res.data.longitude)

        if (res.data.objectFormatParameterValues?.length) {
          replace(res.data.objectFormatParameterValues)
        }
      }
    })()
  }, [id])

  async function objectFormatChange(event: string, onChange: (...event: any[]) => void) {
    if (!event) {
      replace([])
      return
    }

    const res = await http('/api/handlers/generic/objectFormatParameters/findByObjectFormatId', {
      method: 'POST',
      body: JSON.stringify({ id: event }),
    })
    if (!res.ok) return

    replace(
      res.data.map((ofp: ObjectFormatParameter) => ({
        objectFormatParameter: ofp,
        value: { value: '' },
      }))
    )

    onChange(event)
  }

  async function handleMarker(event: GeoLocation) {
    form.setValue('latitude', event.lat)
    form.setValue('longitude', event.lng)
  }

  console.log(form.formState.errors)

  return (
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
              <Input placeholder="Identificação do objeto localizado" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="explosive.id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Explosivo</FormLabel>
              <SelectWithDynamicOptions
                tag="explosives"
                value={field.value?.toString()}
                onValueChange={field.onChange}
                placeholder="Selecione o tipo de explosivo"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ground.id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Solo</FormLabel>
              <SelectWithDynamicOptions
                tag="grounds"
                value={field.value?.toString()}
                onValueChange={field.onChange}
                placeholder="Selecione o tipo de solo"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="objectFormat.id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formato do objeto</FormLabel>
              <SelectWithDynamicOptions
                tag="objectFormats"
                value={field.value?.toString()}
                onValueChange={(e) => objectFormatChange(e, field.onChange)}
                placeholder="Selecione o formato do objeto"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {form.getValues('objectFormat.id') && (
          <>
            <Separator className="lg:col-span-2 space-y-2" />
            <h2 className="text-lg font-medium lg:col-span-2">Dados Formato do Objeto</h2>
          </>
        )}

        {objectFormatParameterValuesFields.map((ofpvf, i) => (
          <FormField
            key={ofpvf.id}
            control={form.control}
            name={`objectFormatParameterValues.${i}.value.value`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{ofpvf.objectFormatParameter.parameter.name}</FormLabel>
                <Input type="number" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Separator className="lg:col-span-2" />
        {latError && (
          <p className="text-[0.8rem] font-medium text-destructive">Marque a localização no mapa</p>
        )}
        <div className="rounded-md bg-primary/10 h-96 w-full lg:col-span-2">
          <Maps onMarkerChange={(e) => handleMarker(e)} />
        </div>
        <Separator className="lg:col-span-2" />
        <Button type="submit" className="lg:col-span-2">
          {id ? 'Atualizar Objeto Localizado' : 'Criar Objeto Localizado'}
        </Button>
      </form>
    </Form>
  )
}
