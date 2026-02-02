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
import { fetchAddressByCep, maskCep } from '@/utils/cep'
import { useEffect, useState, useRef } from 'react'

async function getAddressFromLatLng(lat: number, lng: number): Promise<string> {
  if (typeof window === 'undefined' || !window.google) return ''
  return new Promise((resolve) => {
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        resolve(results[0].formatted_address)
      } else {
        resolve('')
      }
    })
  })
}

async function getLatLngFromAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (typeof window === 'undefined' || !window.google) return null
  return new Promise((resolve) => {
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location
        resolve({ lat: location.lat(), lng: location.lng() })
      } else {
        resolve(null)
      }
    })
  })
}
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
      street: '',
      number: '',
      city: '',
      cep: '',
      latitude: undefined,
      longitude: undefined,
      explosive: undefined,
      ground: undefined,
      objectFormat: undefined,
      objectFormatParameterValues: [],
    },
  })

  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [city, setCity] = useState('')
  const [cep, setCep] = useState('')
  const isUpdatingFromMap = useRef(false)

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
        form.setValue('street', res.data.street || '')
        form.setValue('number', res.data.number || '')
        form.setValue('city', res.data.city || '')
        form.setValue('cep', res.data.cep || '')
        form.setValue('explosive', res.data.explosive)
        form.setValue('ground', res.data.ground)
        form.setValue('objectFormat', res.data.objectFormat)
        form.setValue('latitude', res.data.latitude)
        form.setValue('longitude', res.data.longitude)

        setStreet(res.data.street || '')
        setNumber(res.data.number || '')
        setCity(res.data.city || '')
        setCep(res.data.cep || '')

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
    isUpdatingFromMap.current = true
    const addr = await getAddressFromLatLng(event.lat, event.lng)
    if (addr) {
      const parts = addr.split(',')
      setStreet(parts[0]?.trim() || '')
      setNumber(parts[1]?.replace(/[^0-9]/g, '').trim() || '')
      setCity(parts[2]?.trim() || '')
      setCep(parts.find((p) => /\d{5}-?\d{3}/.test(p))?.match(/\d{5}-?\d{3}/)?.[0] || '')
      form.setValue('street', parts[0]?.trim() || '')
      form.setValue('number', parts[1]?.replace(/[^0-9]/g, '').trim() || '')
      form.setValue('city', parts[2]?.trim() || '')
      form.setValue(
        'cep',
        parts.find((p) => /\d{5}-?\d{3}/.test(p))?.match(/\d{5}-?\d{3}/)?.[0] || ''
      )
    }
    isUpdatingFromMap.current = false
  }

  async function handleStreetChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setStreet(value)
    form.setValue('street', value)
    await tryGeocode()
  }
  async function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setNumber(value)
    form.setValue('number', value)
    await tryGeocode()
  }
  async function handleCityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setCity(value)
    form.setValue('city', value)
    await tryGeocode()
  }
  async function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    const masked = maskCep(raw)
    setCep(masked)
    form.setValue('cep', masked)

    const cleanCep = raw.replace(/\D/g, '')
    if (cleanCep.length === 8) {
      const data = await fetchAddressByCep(cleanCep)
      if (data) {
        setStreet(data.street)
        setCity(data.city)
        form.setValue('street', data.street)
        form.setValue('city', data.city)
        await tryGeocode()
      }
    } else {
      await tryGeocode()
    }
  }

  async function tryGeocode() {
    if (isUpdatingFromMap.current) return
    const fullAddress = [street, number, city, cep].filter(Boolean).join(', ')
    if (fullAddress.length > 8) {
      const coords = await getLatLngFromAddress(fullAddress)
      if (coords) {
        form.setValue('latitude', coords.lat)
        form.setValue('longitude', coords.lng)
      }
    }
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
                <FormLabel>{ofpvf.objectFormatParameter.parameter.name} (cm)</FormLabel>
                <Input type="number" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Separator className="lg:col-span-2" />

        <h2 className="text-lg font-medium lg:col-span-2">Endereço</h2>

        <FormItem>
          <FormLabel>Rua</FormLabel>
          <Input placeholder="Rua" value={street} onChange={handleStreetChange} />
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Número</FormLabel>
          <Input placeholder="Número" value={number} onChange={handleNumberChange} />
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Cidade</FormLabel>
          <Input placeholder="Cidade" value={city} onChange={handleCityChange} />
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>CEP</FormLabel>
          <Input placeholder="CEP" value={cep} onChange={handleCepChange} maxLength={9} />
          <FormMessage />
        </FormItem>

        {latError && (
          <p className="text-[0.8rem] font-medium text-destructive">Marque a localização no mapa</p>
        )}
        <div className="rounded-md bg-primary/10 h-96 w-full lg:col-span-2">
          <Maps
            onMarkerChange={handleMarker}
            initialMarker={{ lat: form.watch('latitude'), lng: form.watch('longitude') }}
          />
        </div>
        <Separator className="lg:col-span-2" />
        <Button type="submit" className="lg:col-span-2">
          {id ? 'Atualizar Objeto Localizado' : 'Criar Objeto Localizado'}
        </Button>
      </form>
    </Form>
  )
}
