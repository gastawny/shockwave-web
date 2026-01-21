'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { LocatedObjectRegister } from '@/screens/new-event/located-object-register'
import { BombThreatRegister } from '@/screens/new-event/bomb-threat-register'

const eventOptions = [
  { value: '1', label: 'Ameaça de Bomba', url: <BombThreatRegister /> },
  { value: '2', label: 'Objeto Localizado', url: <LocatedObjectRegister /> },
  // { value: '3', label: 'Pós-Explosão', component: <PosComponent /> },
]

export default function NewEventPage() {
  const [newEvent, setNewEvent] = useState('')

  return (
    <div className="flex flex-col gap-4">
      <h1 className="ml-10 lg:ml-0 text-xl lg:text-2xl font-bold">Novo Evento</h1>
      <Select value={newEvent} onValueChange={setNewEvent}>
        <SelectTrigger className="w-full lg:w-64">
          <SelectValue placeholder="Selecione o evento" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {eventOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Separator />
    </div>
  )
}
