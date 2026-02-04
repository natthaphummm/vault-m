import { createRootRoute, Outlet } from '@tanstack/react-router'

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { Home, Backpack, Toolbox, Settings } from 'lucide-react'

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home
  },
  {
    title: 'Inventory',
    url: '/inventory',
    icon: Backpack
  },
  {
    title: 'Crafting',
    url: '/crafting',
    icon: Toolbox
  },
  {
    title: 'Settings',
    url: '/setting',
    icon: Settings
  }
]

const RootLayout = () => (
  <SidebarProvider>
    <AppSidebar items={items} />
    <main className="w-full">
      <SidebarTrigger />
      <Outlet />
    </main>
  </SidebarProvider>
)

export const Route = createRootRoute({ component: RootLayout })
