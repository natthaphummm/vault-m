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

export interface IApi {
  getItems: () => Promise<Item[]>
  getInventory: () => Promise<InventoryItem[]>
  saveItem: (item: Item) => Promise<boolean>
  deleteItem: (id: number) => Promise<boolean>
  updateInventory: (itemId: number, amount: number) => Promise<boolean>
  getCraftingRecipes: () => Promise<CraftingRecipe[]>
  saveCraftingRecipe: (recipe: CraftingRecipe) => Promise<boolean>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IApi
  }
}
