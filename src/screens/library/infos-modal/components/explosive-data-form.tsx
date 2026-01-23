'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { fetcher } from '@/infra/fetcher'
import { Parameter } from '@/types/parameter'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

type ExplosiveParamValue = {
  explosive_parameter_id?: number
  parameter_id: number
  name: string
  value: string | null
  value_type: string | null
}

type Props = {
  method: 'PUT' | 'POST'
  explosiveId?: number | null
  onSaved?: () => void
}

type FormValues = {
  name: string
  parameterValues: Array<{
    parameter_id: number
    explosive_parameter_id?: number
    name: string
    value: string | null
    value_type: string | null
  }>
}

export default function ExplosiveDataForm({ method, explosiveId, onSaved }: Props) {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    defaultValues: { name: '', parameterValues: [] },
  })

  const { control, handleSubmit, reset, register } = form
  const { fields, replace } = useFieldArray({ control, name: 'parameterValues' })

  const templateQuery = useQuery({
    queryKey: ['explosive-parameters'],
    queryFn: async () =>
      await fetcher('/api/handlers/generic/parameters/getTableParameters', {
        method: 'POST',
        body: JSON.stringify({ tableName: 'explosives' }),
        justReturnResponse: false,
      }),
    staleTime: 60 * 1000,
  })

  const dataQuery = useQuery({
    queryKey: ['explosive-data', explosiveId],
    queryFn: async () =>
      await fetcher('/api/handlers/generic/explosives/getDataByExplosiveId', {
        method: 'POST',
        body: JSON.stringify({ id: explosiveId }),
        justReturnResponse: false,
      }),
    staleTime: 60 * 1000,
    enabled: method === 'PUT' && !!explosiveId,
  })

  useEffect(() => {
    if (!templateQuery.data) return

    const tmpl: any = templateQuery.data
    const templateParams: any[] = Array.isArray(tmpl)
      ? tmpl
      : tmpl?.parametersValues ?? tmpl?.parameters ?? []

    const baseRows: ExplosiveParamValue[] = templateParams.map((p: any) => ({
      parameter_id: p.parameter_id ?? p.id,
      explosive_parameter_id: p.explosive_parameter_id,
      name: p.name,
      value: p.value ?? '',
      value_type: p.valueType ?? null,
    }))

    const resp = dataQuery.data
    const dataParams: any[] = Array.isArray(resp)
      ? resp
      : resp?.parametersValues ?? resp?.data ?? []

    const valuesByParamId = new Map<number, any>()
    dataParams.forEach((d: any) => valuesByParamId.set(d.parameter_id, d))

    const merged = baseRows.map((r) => {
      const d = valuesByParamId.get(r.parameter_id)
      return d
        ? {
            ...r,
            explosive_parameter_id: d.explosive_parameter_id ?? r.explosive_parameter_id,
            value: d.value ?? r.value ?? '',
            value_type: d.value_type ?? r.value_type ?? null,
          }
        : r
    })

    // extract name from response or template
    let extractedName: string | undefined
    if (resp && !Array.isArray(resp))
      extractedName = resp.name ?? resp.explosive?.name ?? resp.explosiveName ?? resp.data?.name
    if (!extractedName) extractedName = tmpl?.explosive?.name

    reset({ name: extractedName ?? '', parameterValues: merged })
    replace(merged)
  }, [method, explosiveId, templateQuery.data, dataQuery.data, reset, replace])

  const saveMutation = useMutation({
    mutationFn: async (body: any) =>
      await fetcher('/api/handlers', {
        method: method === 'POST' ? 'POST' : 'PUT',
        body: JSON.stringify({
          type: 'explosives',
          data: {
            explosive: {
              id: body.id,
              name: body.name,
            },
            parametersValues: body.parameterValues,
          },
        }),
      }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['library', 'explosives'] })
      queryClient.invalidateQueries({ queryKey: ['select-dynamic-options', 'explosives'] })
      queryClient.invalidateQueries({ queryKey: ['explosive-data', explosiveId], exact: true })
      toast({ title: 'Explosivo salvo com sucesso' })
      onSaved?.()
    },
    onError: () => toast({ variant: 'destructive', title: 'Erro ao salvar explosivo' }),
  })

  const onSubmit = async (values: FormValues) => {
    if (!values.name?.trim()) {
      // set simple field error via reset with message is more complex; show toast instead
      toast({ variant: 'destructive', title: 'O nome é obrigatório' })
      return
    }

    const payload = {
      id: explosiveId,
      name: values.name,
      parameterValues: values.parameterValues.map((r) => ({
        parameterId: r.parameter_id,
        explosiveParameterId: r.explosive_parameter_id,
        value: r.value,
        valueType: r.value_type,
      })),
    }

    await saveMutation.mutateAsync(payload)
  }

  if (loading) return <div>Carregando...</div>

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-1">
        <div className="grid mb-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {fields.map((f, index) => (
            <FormField
              key={(f as any).parameter_id ?? f.id}
              control={control}
              name={`parameterValues.${index}.value` as const}
              render={({ field }) => (
                <FormItem className="grid gap-1 col-span-3 xl:col-span-1">
                  <FormLabel>{(f as any).name}</FormLabel>
                  <FormControl>
                    <>
                      <Input {...field} />
                      <input
                        type="hidden"
                        {...register(`parameterValues.${index}.parameter_id` as const)}
                        defaultValue={(f as any).parameter_id}
                      />
                      <input
                        type="hidden"
                        {...register(`parameterValues.${index}.explosive_parameter_id` as const)}
                        defaultValue={(f as any).explosive_parameter_id}
                      />
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
          ))}

          <Button className="col-span-3 text-right" type="submit" disabled={saveMutation.isPending}>
            {method === 'PUT' ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
