import { ElectronAPI } from '@electron-toolkit/preload'

export interface Item {
  id: number
  name: string
  price: number
  category: string
  image?: string
}

export interface InventoryItem {
  itemId: number
  amount: number
}

export interface IApi {
  getItems: () => Promise<Item[]>
  getInventory: () => Promise<InventoryItem[]>
  saveItem: (item: Item) => Promise<boolean>
  deleteItem: (id: number) => Promise<boolean>
  updateInventory: (itemId: number, amount: number) => Promise<boolean>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IApi
  }
}
