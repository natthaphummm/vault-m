import { createFileRoute } from '@tanstack/react-router'
import { Moon, Sun, Laptop, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
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
  const [version, setVersion] = useState<string>('')
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const getVersion = async () => {
      const v = await window.api.app.getVersion()
      setVersion(v)
    }
    getVersion()
  }, [])

  const handleCheckUpdate = async () => {
    setIsChecking(true)
    try {
      const result = await window.api.app.checkUpdate()
      if (result.updateAvailable) {
        toast.success(result.message)
      } else {
        toast.info(result.message)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to check for updates')
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="w-full">
      <div className="px-4 md:px-6 pt-4 md:pt-6">
        <h1 className="mb-4 scroll-m-20 text-2xl font-extrabold tracking-tight text-balance">
          Settings
        </h1>
      </div>

      <div className="p-4 space-y-2">
        <ItemGroup>
          <Item variant="outline">
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

        <ItemGroup>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Application Version</ItemTitle>
              <ItemDescription>Current version: v{version}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" onClick={handleCheckUpdate} disabled={isChecking}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                {isChecking ? 'Checking...' : 'Check for Update'}
              </Button>
            </ItemActions>
          </Item>
        </ItemGroup>
      </div>
    </div>
  )
}
