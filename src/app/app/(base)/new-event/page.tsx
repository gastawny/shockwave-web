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
import AmeacaComponent from './ameaca'
import LocalizadoComponent from './localizado'
import PosComponent from './pos'

export default function NewEventPage() {
  const [newEvent, setNewEvent] = useState('')

  return (
    <>
      <h1 className="text-xl absolute top-4 left-16 font-bold">Novo Evento</h1>
      <div className="absolute top-16 w-full">
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
        {newEvent === '1' && <AmeacaComponent />}
        {newEvent === '2' && <LocalizadoComponent />}
        {newEvent === '3' && <PosComponent />}
      </div>
    </>
  )
}
