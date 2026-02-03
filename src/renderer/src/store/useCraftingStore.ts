import { create } from 'zustand'
import type { CraftingRecipe } from '@renderer/types'


interface CraftingState {
    // Data
    recipes: CraftingRecipe[]
    setRecipes: (recipes: CraftingRecipe[] | ((prev: CraftingRecipe[]) => CraftingRecipe[])) => void
    fetchRecipes: () => Promise<void>
    saveRecipe: (recipe: CraftingRecipe) => Promise<void>
    deleteRecipe: (id: number) => Promise<void>

    // Selection & Filtering
    selectedRecipe: CraftingRecipe | null
    setSelectedRecipe: (recipe: CraftingRecipe | null) => void
    filterCategory: string
    setFilterCategory: (category: string) => void

    // UI & Modal State
    isRecipeModalOpen: boolean
    setIsRecipeModalOpen: (isOpen: boolean) => void
    editingRecipe: CraftingRecipe | null
    setEditingRecipe: (recipe: CraftingRecipe | null) => void // 0 id means new

    isCraftModalOpen: boolean
    setIsCraftModalOpen: (isOpen: boolean) => void
    activeCraft: CraftingRecipe | null
    setActiveCraft: (recipe: CraftingRecipe | null) => void

    // Helper Actions
    openNewRecipeModal: () => void
    openEditRecipeModal: (recipe: CraftingRecipe) => void
    openCraftModal: (recipe: CraftingRecipe) => void
    closeAllModals: () => void
}

export const useCraftingStore = create<CraftingState>((set, get) => ({
    // Data
    recipes: [],
    setRecipes: (recipes) => set((state) => ({
        recipes: typeof recipes === 'function' ? recipes(state.recipes) : recipes
    })),
    fetchRecipes: async () => {
        try {
            const recipes = await window.api.crafting.getAll()
            set({ recipes: recipes })
        } catch (error) {
            console.error('Failed to fetch recipes:', error)
        }
    },
    saveRecipe: async (recipe) => {
        try {
            await window.api.crafting.save(recipe)
            await get().fetchRecipes()
            set({ isRecipeModalOpen: false, editingRecipe: null })
        } catch (error) {
            console.error('Failed to save recipe:', error)
            throw error
        }
    },
    deleteRecipe: async (id) => {
        try {
            await window.api.crafting.delete(id)
            await get().fetchRecipes()
            set((state) => ({
                selectedRecipe: state.selectedRecipe?.id === id ? null : state.selectedRecipe
            }))
        } catch (error) {
            console.error('Failed to delete recipe:', error)
            throw error
        }
    },

    // Selection
    selectedRecipe: null,
    setSelectedRecipe: (selectedRecipe) => set({ selectedRecipe }),
    filterCategory: 'All',
    setFilterCategory: (filterCategory) => set({ filterCategory }),

    // UI
    isRecipeModalOpen: false,
    setIsRecipeModalOpen: (isRecipeModalOpen) => set({ isRecipeModalOpen }),
    editingRecipe: null,
    setEditingRecipe: (editingRecipe) => set({ editingRecipe }),

    isCraftModalOpen: false,
    setIsCraftModalOpen: (isCraftModalOpen) => set({ isCraftModalOpen }),
    activeCraft: null,
    setActiveCraft: (activeCraft) => set({ activeCraft }),

    // Helpers
    openNewRecipeModal: () => set({
        editingRecipe: { id: 0, name: '', category: 'General', successChance: 100, costs: [], results: [] },
        isRecipeModalOpen: true
    }),
    openEditRecipeModal: (recipe) => set({ editingRecipe: recipe, isRecipeModalOpen: true }),
    openCraftModal: (recipe) => set({ activeCraft: recipe, isCraftModalOpen: true }),
    closeAllModals: () => set({
        isRecipeModalOpen: false,
        isCraftModalOpen: false,
        editingRecipe: null,
        activeCraft: null
    })
}))
