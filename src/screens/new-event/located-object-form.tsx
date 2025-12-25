'use client'

import { SelectDynamicOptions } from '@/components/select-dynamic-options'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { http } from '@/infra/http'
import { LocatedObjectSchema, LocatedObject } from '@/types/located-object'
import { ObjectFormatParameter } from '@/types/object-format-parameter'
import { zodResolver } from '@hookform/resolvers/zod'
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
              <Select onValueChange={field.onChange} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de explosivo" />
                  </SelectTrigger>
                </FormControl>
                <SelectDynamicOptions tag="explosives" />
              </Select>
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
              <Select onValueChange={field.onChange} value={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de solo" />
                  </SelectTrigger>
                </FormControl>
                <SelectDynamicOptions tag="grounds" />
              </Select>
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
              <Select
                onValueChange={(e) => objectFormatChange(e, field.onChange)}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato do objeto" />
                  </SelectTrigger>
                </FormControl>
                <SelectDynamicOptions tag="objectFormats" />
              </Select>
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
        <Button type="submit" className="lg:col-span-2">
          Salvar
        </Button>
      </form>
    </Form>
  )
}
