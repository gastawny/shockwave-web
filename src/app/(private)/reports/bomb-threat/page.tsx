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
import { API_URL } from '@/config/variables'
import { fetcher } from '@/infra/fetcher'
import { useLoading } from '@/infra/providers/loading-provider'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useMemo, useState } from 'react'

type BombThreatReport = {
  id: number
  name: string
  createdAt: string
}

export default function ReportsPage() {
  const { setLoading } = useLoading()
  const [search, setSearch] = useState('')

  const { data } = useSuspenseQuery<BombThreatReport[]>({
    queryKey: ['reports', 'bombThreats'],
    queryFn: async () => await fetcher('/api/reports/bombThreats', { justReturnResponse: false }),
  })

  const filteredData = useMemo(() => {
    if (!data) return []

    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        formatDate(item.createdAt).includes(search.toLowerCase())
    )
  }, [data, search])

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  async function handleDownloadReport(id: number) {
    const res = await fetch(`${API_URL}/api/reports/bombThreats/${id}`, {
      headers: { 'Content-Type': 'application/pdf' },
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
        <CardContent className="p-6">
          <ScrollArea className="h-full w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Número</TableHead>
                  <TableHead className="text-right">Data de ocorrência</TableHead>
                  <TableHead className="text-right w-16"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredData.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell className="text-right">{formatDate(d.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => setLoading(() => handleDownloadReport(d.id))}
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
