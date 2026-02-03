import { createFileRoute } from '@tanstack/react-router'
import { Moon, Sun, Laptop } from 'lucide-react'

import { useTheme } from '@/components/theme-provider'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle
} from '@/components/ui/item'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export const Route = createFileRoute('/setting')({
  component: Setting
})

function Setting() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="w-full">
      <div className="px-4 md:px-6 pt-4 md:pt-6">
        <h1 className="mb-4 scroll-m-20 text-2xl font-extrabold tracking-tight text-balance">
          Settings
        </h1>
      </div>

      <div className="p-4 space-y-6">
        <ItemGroup>
          <Item>
            <ItemContent>
              <ItemTitle>Theme</ItemTitle>
              <ItemDescription>Select the theme for the dashboard.</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme" className="w-[180px]">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      <span>Light</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <span>Dark</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4" />
                      <span>System</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </ItemActions>
          </Item>
        </ItemGroup>
      </div>
    </div>
  )
}
