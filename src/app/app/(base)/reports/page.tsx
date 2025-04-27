'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useEffect, useState } from 'react'

const data = [
  {
    num: '0012563/2025',
    occurredDate: '23/02/2025',
  },
  {
    num: '0012564/2025',
    occurredDate: '23/02/2025',
  },
  {
    num: '0012565/2025',
    occurredDate: '23/02/2025',
  },
  {
    num: '0012566/2025',
    occurredDate: '23/02/2025',
  },
  {
    num: '0012567/2025',
    occurredDate: '23/02/2025',
  },
  {
    num: '0012568/2025',
    occurredDate: '23/02/2025',
  },
  {
    num: '0012569/2025',
    occurredDate: '23/02/2025',
  },
  {
    num: '0012570/2025',
    occurredDate: '23/02/2025',
  },
  {
    num: '0012571/2025',
    occurredDate: '23/02/2025',
  },
  {
    num: '0012572/2025',
    occurredDate: '23/02/2025',
  },
]

export default function ReportsPage() {
  const [search, setSearch] = useState('')
  const [filteredData, setFilteredData] = useState(data)

  useEffect(() => {
    const filtered = data.filter((item) => {
      return item.num.toLowerCase().includes(search.toLowerCase())
    })
    setFilteredData(filtered)
  }, [search])

  return (
    <>
      <h1 className="text-xl absolute top-4 left-16 font-bold">Relatórios</h1>
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full px-4 flex flex-col gap-4">
        <Button variant="outline">Baixar relatório</Button>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 mb-6">
              <Input
                placeholder="pesquisar..."
                className="border-slate-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Número</TableHead>
                  <TableHead className="text-right">Data de ocorrência</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((d) => (
                  <TableRow key={d.num}>
                    <TableCell className="font-medium">{d.num}</TableCell>
                    <TableCell className="text-right">{d.occurredDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
