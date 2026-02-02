import { create } from 'zustand'
import { Recipe } from '@renderer/types'
import { INITIAL_RECIPES } from '@renderer/data/recipes'

interface CraftingState {
    // Data
    recipes: Recipe[]
    setRecipes: (recipes: Recipe[] | ((prev: Recipe[]) => Recipe[])) => void

    // Selection & Filtering
    selectedRecipe: Recipe | null
    setSelectedRecipe: (recipe: Recipe | null) => void
    filterCategory: string
    setFilterCategory: (category: string) => void

    // UI & Modal State
    isRecipeModalOpen: boolean
    setIsRecipeModalOpen: (isOpen: boolean) => void
    editingRecipe: Recipe | null
    setEditingRecipe: (recipe: Recipe | null) => void // 0 id means new

    isCraftModalOpen: boolean
    setIsCraftModalOpen: (isOpen: boolean) => void
    activeCraft: Recipe | null
    setActiveCraft: (recipe: Recipe | null) => void

    // Helper Actions
    openNewRecipeModal: () => void
    openEditRecipeModal: (recipe: Recipe) => void
    openCraftModal: (recipe: Recipe) => void
    closeAllModals: () => void
}

export const useCraftingStore = create<CraftingState>((set) => ({
    // Data
    recipes: INITIAL_RECIPES,
    setRecipes: (recipes) => set((state) => ({
        recipes: typeof recipes === 'function' ? recipes(state.recipes) : recipes
    })),

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
