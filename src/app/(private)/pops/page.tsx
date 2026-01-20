'use client'

import { Button } from '@/components/ui/button'

const pops = [
  { code: 'POP_200_6', title: '200.6 - Ameaça de Bomba' },
  { code: 'POP_200_7', title: '200.7 - Objeto Localizado' },
  { code: 'POP_200_8', title: '200.8 - Explosão de Bomba' },
]

export default function POPsPage() {
  async function handleButtonClick(popCode: string) {
    const pdfPath = `/pdfs/pops/${popCode}.pdf`
    window.open(pdfPath, '_blank')
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="ml-10 lg:ml-0 text-xl lg:text-2xl font-bold mb-4">POPs</h1>
      {pops.map((pop) => (
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => handleButtonClick(pop.code)}
        >
          {pop.title}
        </Button>
      ))}
    </div>
  )
}
