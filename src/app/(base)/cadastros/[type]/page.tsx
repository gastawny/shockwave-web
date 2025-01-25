import { registerSlugs } from '@/utils/constants/registerSlugs'
import { notFound } from 'next/navigation'
import { RegisterTable } from './register-table'
import { http } from '@/infra/http'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default async function CadastrosPage({ params: { type } }: { params: { type: string } }) {
  if (!Object.keys(registerSlugs).includes(type)) notFound()

  const typeObj = registerSlugs[type as keyof typeof registerSlugs]

  const res = await http('/api/grounds', {
    tags: ['grounds'],
  })
  if (!res.ok) console.error('Error fetching data')

  const solos = await res.json()

  return (
    <div className="flex flex-col gap-4">
      <header className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden :block">
                <BreadcrumbLink href="#">Cadastros</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden :block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{typeObj.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <RegisterTable data={solos} />
    </div>
  )
}
