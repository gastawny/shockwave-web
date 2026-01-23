'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from './ui/sidebar'
import { usePathname, useRouter } from 'next/navigation'
import { sideBarData } from '@/utils/data/side-bar-data'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { LogOut, Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { cookies } from '@/infra/cookies'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const item = sideBarData.navMain.find((item) =>
    item.items.find((subItem) => subItem.url === pathname)
  )

  const subItem = item?.items.find((subItem) => subItem.url === pathname)

  async function handleLogout() {
    cookies.remove('at')
    cookies.remove('rt')
    cookies.remove('e')

    router.push('/login')
  }

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage className="text-muted-foreground">{item?.title}</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{subItem?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {mounted ? theme === 'dark' ? <Sun /> : <Moon /> : <Sun />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Alternar tema</p>
            </TooltipContent>
          </Tooltip>

          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <LogOut />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sair</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent>
              <DialogHeader>
                <h3 className="text-lg font-medium">Confirmação de Logout</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tem certeza de que deseja sair da sua conta?
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button variant="destructive" onClick={handleLogout}>
                    Sair
                  </Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}
