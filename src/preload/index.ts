import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getItems: () => ipcRenderer.invoke('items:get-all'),
  getInventory: () => ipcRenderer.invoke('inventory:get-all'),
  saveItem: (item: any) => ipcRenderer.invoke('items:save', item),
  deleteItem: (id: number) => ipcRenderer.invoke('items:delete', id),
  updateInventory: (itemId: number, amount: number) =>
    ipcRenderer.invoke('inventory:update', { itemId, amount }),
  getCraftingRecipes: () => ipcRenderer.invoke('crafting:get-all'),
  saveCraftingRecipe: (recipe: any) => ipcRenderer.invoke('crafting:save', recipe)
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
