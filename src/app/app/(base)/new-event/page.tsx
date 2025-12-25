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
import PosComponent from './pos'
import { Separator } from '@/components/ui/separator'
import LocatedObjectForm from '@/screens/new-event/located-object-form'
import { BombThreatForm } from '@/screens/new-event/bomb-threat-form'
import { LocatedObjectRegister } from '@/screens/new-event/located-object-register'

export default function NewEventPage() {
  const [newEvent, setNewEvent] = useState('')

  return (
    // <div className="flex flex-col gap-4">
    //   <h1 className="ml-10 lg:ml-0 text-xl font-bold">Novo Evento</h1>
    //   <Select value={newEvent} onValueChange={setNewEvent}>
    //     <SelectTrigger className="w-full lg:w-64">
    //       <SelectValue placeholder="Selecione o evento" />
    //     </SelectTrigger>
    //     <SelectContent>
    //       <SelectGroup>
    //         <SelectItem value="1">Ameaça de Bomba</SelectItem>
    //         <SelectItem value="2">Objeto Localizado</SelectItem>
    //         <SelectItem value="3">Pós-Explosão</SelectItem>
    //       </SelectGroup>
    //     </SelectContent>
    //   </Select>
    //   <Separator />
    //   {newEvent === '1' && <AmeacaComponent />}
    //   {newEvent === '2' && <LocatedObjectForm />}
    //   {newEvent === '3' && <PosComponent />}
    <BombThreatForm />
    // <LocatedObjectRegister />
    // </div>
  )
}
