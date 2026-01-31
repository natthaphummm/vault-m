import { create } from 'zustand'

interface InvFilterState {
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
}

export const useInvFilterStore = create<InvFilterState>((set) => ({
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
        })
}))
