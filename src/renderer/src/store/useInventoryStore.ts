import { create } from 'zustand'
import { Item } from '@renderer/types'

interface InventoryState {
    // Filter State
    searchQuery: string
    setSearchQuery: (query: string) => void
    filterInStock: boolean
    setFilterInStock: (inStock: boolean) => void
    filterCategory: string
    setFilterCategory: (category: string) => void
    showAmount: boolean
    setShowAmount: (show: boolean) => void
    showPrice: boolean
    setShowPrice: (show: boolean) => void
    showTotalValue: boolean
    setShowTotalValue: (show: boolean) => void
    resetFilters: () => void

    // Edit/Dialog State
    editingItem: Item | null
    isDialogOpen: boolean
    setEditingItem: (item: Item | null) => void
    setIsDialogOpen: (isOpen: boolean) => void
    openNewItemDialog: () => void
    openEditItemDialog: (item: Item) => void
    closeDialog: () => void
}

export const useInventoryStore = create<InventoryState>((set) => ({
    // Filter State
    searchQuery: '',
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    filterInStock: false,
    setFilterInStock: (filterInStock) => set({ filterInStock }),
    filterCategory: 'All',
    setFilterCategory: (filterCategory) => set({ filterCategory }),
    showAmount: true,
    setShowAmount: (showAmount) => set({ showAmount }),
    showPrice: true,
    setShowPrice: (showPrice) => set({ showPrice }),
    showTotalValue: true,
    setShowTotalValue: (showTotalValue) => set({ showTotalValue }),
    resetFilters: () =>
        set({
            searchQuery: '',
            filterInStock: false,
            filterCategory: 'All',
            showAmount: true,
            showPrice: true,
            showTotalValue: true
        }),

    // Edit/Dialog State
    editingItem: null,
    isDialogOpen: false,
    setEditingItem: (editingItem) => set({ editingItem }),
    setIsDialogOpen: (isDialogOpen) => set({ isDialogOpen }),
    openNewItemDialog: () => set({ editingItem: null, isDialogOpen: true }),
    openEditItemDialog: (item) => set({ editingItem: item, isDialogOpen: true }),
    closeDialog: () => set({ isDialogOpen: false, editingItem: null })
}))
