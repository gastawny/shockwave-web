'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import MapsComponent from '@/components/maps'
import React from 'react'

export default function AmeacaComponent() {
  const [newEvent, setNewEvent] = React.useState('')

  return (
    <div className="absolute top-16 w-full">
      <div className="absolute top-16 w-full flex flex-col gap-4">
        <Select value={newEvent} onValueChange={setNewEvent}>
          <SelectTrigger className="w-[calc(100%-2rem)] ">
            <SelectValue placeholder="Selecione o evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">Ameaça de Bomba</SelectItem>
              <SelectItem value="2">Objeto Localizado</SelectItem>
              <SelectItem value="3">Pós-Explosão</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <MapsComponent />
      </div>
    </div>
  )
}
