'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'

export default function LibraryPopsPage() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={2}>Nome</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>200.6 - Ameaça de Bomba</TableCell>
          <TableCell>
            <Button asChild variant="ghost">
              <Link target="_blank" href="/pdfs/pops/POP_200_6.pdf">
                Baixar
              </Link>
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>200.7 - Objeto Localizado</TableCell>
          <TableCell>
            <Button asChild variant="ghost">
              <Link target="_blank" href="/pdfs/pops/POP_200_7.pdf">
                Baixar
              </Link>
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>200.8 - Explosão de Bomba</TableCell>
          <TableCell>
            <Button asChild variant="ghost">
              <Link target="_blank" href="/pdfs/pops/POP_200_8.pdf">
                Baixar
              </Link>
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
