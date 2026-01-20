import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { cookies } from '@/infra/cookies'

export default async function BaseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const defaultOpen = (await cookies.get('sidebar:state')) === 'true'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="p-4">{children}</SidebarInset>
    </SidebarProvider>
  )
}
