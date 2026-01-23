'use client'

import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { sideBarData } from '@/utils/data/side-bar-data'
import { useUserStore } from '@/infra/stores/user-store-provider'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserStore()
  const pathname = usePathname()

  function matchPath(url: string) {
    return pathname === url
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarContent className="gap-0">
        {sideBarData.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen={item.defaultOpen || item.items.some((subItem) => matchPath(subItem.url))}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {item.title}{' '}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => {
                      if (item.admin === true) {
                        if (!user?.roles?.includes('MANAGER')) {
                          return null
                        }
                      }

                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild isActive={matchPath(item.url)}>
                            <Link href={item.url}>{item.title}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
