import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { cookies } from '@/infra/cookies'

export default async function AppBaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const defaultOpen = (await cookies.get('sidebar:state')) === 'true'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SidebarTrigger className="absolute top-4 left-4 bg-accent/40 z-50" />
      <AppSidebar />
      <SidebarInset className="p-4">{children}</SidebarInset>
    </SidebarProvider>
  )
}
