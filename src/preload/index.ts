import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { createApi } from './api'

// Custom APIs for renderer
// Custom APIs for renderer
const apiBase = createApi(ipcRenderer)

export const api = {
  ...apiBase,
  app: {
    ...apiBase.app,
    onUpdateDownloaded: (callback: () => void) => {
      const subscription = (_event: any) => callback()
      ipcRenderer.on('update:downloaded', subscription)
      return () => ipcRenderer.removeListener('update:downloaded', subscription)
    },
    onDownloadProgress: (callback: (progress: any) => void) => {
      const subscription = (_event: any, progress: any) => callback(progress)
      ipcRenderer.on('update:download-progress', subscription)
      return () => ipcRenderer.removeListener('update:download-progress', subscription)
    },
    onUpdateError: (callback: (error: string) => void) => {
      const subscription = (_event: any, error: string) => callback(error)
      ipcRenderer.on('update:error', subscription)
      return () => ipcRenderer.removeListener('update:error', subscription)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
