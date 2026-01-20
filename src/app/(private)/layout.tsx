import { AppSidebar } from '@/components/app-sidebar'
import { Header } from '@/components/header'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { cookies } from '@/infra/cookies'

export default async function AppBaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const defaultOpen = (await cookies.get('sidebar:state')) === 'true' || true

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col">
          <div className=" flex flex-1 flex-col gap-2">
            <div className="@container/main flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
