import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Home, Inbox, Settings } from 'lucide-react'

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home
  },
  {
    title: 'About',
    url: '/about',
    icon: Inbox
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings
  }
]

const RootLayout = () => (
  <SidebarProvider>
    <AppSidebar items={items} />
    <main>
      <SidebarTrigger />
      <Outlet />
    </main>
    <TanStackRouterDevtools />
  </SidebarProvider>
)

export const Route = createRootRoute({ component: RootLayout })
