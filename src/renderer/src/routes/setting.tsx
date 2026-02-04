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

  // Update States
  const [updateStatus, setUpdateStatus] = useState<
    'idle' | 'available' | 'downloading' | 'downloaded' | 'error'
  >('idle')
  const [updateInfo, setUpdateInfo] = useState<{
    version?: string
    releaseDate?: string
    notes?: string
  } | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const getVersion = async () => {
      const v = await window.api.app.getVersion()
      setVersion(v)
    }
    getVersion()

    // Listeners
    const removeDownloadListener = window.api.app.onDownloadProgress((progress) => {
      setUpdateStatus('downloading')
      setDownloadProgress(progress.percent)
    })

    const removeDownloadedListener = window.api.app.onUpdateDownloaded(() => {
      setUpdateStatus('downloaded')
      toast.success('Update downloaded successfully')
    })

    const removeErrorListener = window.api.app.onUpdateError((err) => {
      setUpdateStatus('error')
      setErrorMessage(err)
      toast.error(`Update error: ${err}`)
    })

    return () => {
      removeDownloadListener()
      removeDownloadedListener()
      removeErrorListener()
    }
  }, [])

  const handleCheckUpdate = async () => {
    setIsChecking(true)
    setErrorMessage('')
    try {
      const result = await window.api.app.checkUpdate()
      if (result.updateAvailable) {
        setUpdateStatus('available')
        setUpdateInfo({
          version: result.version,
          releaseDate: result.releaseDate,
          notes: result.notes
        })
        toast.success(`New version ${result.version} available!`)
      } else {
        setUpdateStatus('idle')
        toast.info('You are on the latest version')
      }
    } catch (error) {
      console.error(error)
      setUpdateStatus('error')
      const msg = error instanceof Error ? error.message : 'Unknown error'
      setErrorMessage(msg)
      toast.error('Failed to check for updates')
    } finally {
      setIsChecking(false)
    }
  }

  const handleStartDownload = async () => {
    try {
      setUpdateStatus('downloading')
      await window.api.app.startDownload()
    } catch (error) {
      console.error(error)
      setUpdateStatus('error')
      setErrorMessage('Failed to start download')
    }
  }

  const handleInstallUpdate = async () => {
    try {
      await window.api.app.installUpdate()
    } catch (error) {
      console.error(error)
      toast.error('Failed to install update')
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
              <ItemDescription>
                Current version: v{version}
                {updateStatus === 'available' && updateInfo && (
                  <div className="mt-2 p-2 bg-muted rounded-md text-sm">
                    <p className="font-semibold">New version available: v{updateInfo.version}</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Released:{' '}
                      {updateInfo.releaseDate
                        ? new Date(updateInfo.releaseDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                )}
                {updateStatus === 'downloading' && (
                  <div className="mt-2">
                    <div className="text-xs mb-1 flex justify-between">
                      <span>Downloading...</span>
                      <span>{Math.round(downloadProgress)}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                {updateStatus === 'downloaded' && (
                  <p className="mt-2 text-green-500 font-medium">Update ready to install!</p>
                )}
                {updateStatus === 'error' && (
                  <p className="mt-2 text-destructive font-medium">Error: {errorMessage}</p>
                )}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              {updateStatus === 'idle' || updateStatus === 'error' ? (
                <Button variant="outline" onClick={handleCheckUpdate} disabled={isChecking}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                  {isChecking ? 'Checking...' : 'Check for Update'}
                </Button>
              ) : updateStatus === 'available' ? (
                <Button onClick={handleStartDownload}>Download Update</Button>
              ) : updateStatus === 'downloading' ? (
                <Button disabled>Downloading...</Button>
              ) : updateStatus === 'downloaded' ? (
                <Button onClick={handleInstallUpdate}>Restart & Install</Button>
              ) : null}
            </ItemActions>
          </Item>
        </ItemGroup>
      </div>
    </div>
  )
}
