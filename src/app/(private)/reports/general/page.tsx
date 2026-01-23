'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetcher } from '@/infra/fetcher'
import { useLoading } from '@/infra/providers/loading-provider'
import { Download } from 'lucide-react'
import { useMemo, useState } from 'react'

const data = [
  {
    name: 'Relatório de Explosivos',
    url: '/api/reports/explosives',
  },
] as const

export default function ReportsPage() {
  const { setLoading } = useLoading()
  const [search, setSearch] = useState('')

  const filteredData = useMemo(() => {
    if (!data) return []

    return data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
  }, [data, search])

  async function handleDownloadReport(id: number) {
    const res = await fetcher(data[id].url, {
      headers: { 'Content-Type': 'application/pdf' },
      justReturnResponse: true,
    })

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    window.open(url)
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      <Input
        placeholder="Pesquisar..."
        className="lg:w-72"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Card className="h-full">
        <CardContent className="p-2">
          <ScrollArea className="h-full w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-full">Relatório</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredData.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => setLoading(() => handleDownloadReport(i))}
                        variant="outline"
                        size="icon"
                      >
                        <Download />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
