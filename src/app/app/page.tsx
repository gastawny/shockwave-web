import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AppPage() {
  return (
    <div className="flex shadow-lg bg-accent/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 w-11/12 px-5 py-8 rounded-2xl">
      <Button asChild size="lg" variant="secondary">
        <Link href="app/new-event">Novo Evento</Link>
      </Button>
      <Button asChild size="lg" variant="secondary">
        <Link href="app/reports">Relatórios</Link>
      </Button>
      <Button asChild size="lg" variant="secondary">
        <Link href="app/pops">POPs</Link>
      </Button>
    </div>
  )
}
