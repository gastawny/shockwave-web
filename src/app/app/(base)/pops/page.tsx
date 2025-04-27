'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

export default function POPsPage() {
  const [value, setValue] = useState('')

  return (
    <>
      <h1 className="text-xl absolute top-4 left-16 font-bold">POPs</h1>
      <div className="absolute top-16 w-full">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-[calc(100%-2rem)] ">
            <SelectValue placeholder="Selecione o POP" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="2006">200.6 - Ameaça de Bomba</SelectItem>
              <SelectItem value="2007">200.7 - Objeto Localizado</SelectItem>
              <SelectItem value="2008">200.8 - Explosão de Bomba</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {value != '' && (
        <div className="flex shadow-lg bg-accent/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 w-11/12 px-5 py-8 rounded-2xl">
          <img src={`/images/${value}.png`} />
        </div>
      )}
    </>
  )
}
