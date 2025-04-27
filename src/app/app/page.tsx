import { Button } from '@/components/ui/button'

export default function AppPage() {
  return (
    <div className="flex shadow-lg bg-accent/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 w-11/12 px-5 py-8 rounded-2xl">
      <Button size="lg" variant="secondary">
        Novo Evento
      </Button>
      <Button size="lg" variant="secondary">
        Relatórios
      </Button>
      <Button size="lg" variant="secondary">
        POPs
      </Button>
    </div>
  )
}
