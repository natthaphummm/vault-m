import { ElectronAPI } from '@electron-toolkit/preload'

export interface Item {
  id: number
  name: string
  price: number
  category: string
  image?: string | null
}

export interface InventoryItem {
  itemId: number
  amount: number
}

export interface CraftingCost {
  itemId: number
  amount: number
  remove: boolean
}

export interface CraftingResult {
  itemId: number
  amount: number
  type: 'success' | 'fail'
}

export interface CraftingRecipe {
  id: number
  name: string
  category: string
  successChance: number
  costs: CraftingCost[]
  results: CraftingResult[]
}

export interface ItemsApi {
  getAll: () => Promise<Item[]>
  save: (item: Item) => Promise<boolean>
  delete: (id: number) => Promise<boolean>
}

export interface InventoryApi {
  getAll: () => Promise<InventoryItem[]>
  update: (itemId: number, amount: number) => Promise<boolean>
}

export interface CraftingApi {
  getAll: () => Promise<CraftingRecipe[]>
  save: (recipe: CraftingRecipe) => Promise<boolean>
  delete: (id: number) => Promise<boolean>
}

export interface IApi {
  items: ItemsApi
  inventory: InventoryApi
  crafting: CraftingApi
  app: AppApi
}

export interface AppApi {
  getVersion: () => Promise<string>
  checkUpdate: () => Promise<{ updateAvailable: boolean; message: string }>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IApi
  }
}
