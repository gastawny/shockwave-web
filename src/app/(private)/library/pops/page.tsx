'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Download } from 'lucide-react'
import Link from 'next/link'

export default function LibraryPopsPage() {
  return (
    <Card className="h-full">
      <CardContent className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2}>Nome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>200.6 - Ameaça de Bomba</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline">
                  <Link target="_blank" href="/pdfs/pops/POP_200_6.pdf">
                    <Download />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>200.7 - Objeto Localizado</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline">
                  <Link target="_blank" href="/pdfs/pops/POP_200_7.pdf">
                    <Download />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>200.8 - Explosão de Bomba</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline">
                  <Link target="_blank" href="/pdfs/pops/POP_200_8.pdf">
                    <Download />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
