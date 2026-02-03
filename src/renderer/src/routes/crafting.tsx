import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { XCircle, CheckCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import { CraftingToolbar } from '../components/crafting/crafting-toolbar'
import { CraftingSplitView } from '../components/crafting/crafting-split-view'
import { CraftingForm } from '../components/crafting/crafting-form'
import { useCraftingStore } from '@/store/useCraftingStore'

export const Route = createFileRoute('/crafting')({
  component: Crafting
})

function Crafting() {
  const queryClient = useQueryClient()

  // Store
  const {
    recipes,
    fetchRecipes,
    deleteRecipe,
    // UI State
    isRecipeModalOpen,
    setIsRecipeModalOpen,
    editingRecipe,
    setEditingRecipe,
    isCraftModalOpen,
    setIsCraftModalOpen,
    activeCraft,
    closeAllModals
  } = useCraftingStore()

  // Data Fetching
  const { data: items = [] } = useQuery({
    queryKey: ['items'],
    queryFn: async () => await window.api.items.getAll()
  })

  const { data: inventory = [] } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => await window.api.inventory.getAll()
  })

  // Fetch recipes on mount
  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes])

  // Handlers
  const handleRecipeSaved = () => {
    closeAllModals()
  }

  const handleDeleteRecipe = async (id: number) => {
    if (confirm('Delete this recipe?')) {
      try {
        await deleteRecipe(id)
        toast.success('Recipe deleted')
      } catch (error) {
        toast.error('Failed to delete recipe')
        console.error(error)
      }
    }
  }

  const handleCraftAction = async (resultType: 'success' | 'fail') => {
    if (!activeCraft) return

    try {
      // 1. Consume costs
      for (const cost of activeCraft.costs) {
        if (cost.remove) {
          const currentInv = inventory.find((i) => i.itemId === cost.itemId)
          const currentAmount = currentInv ? currentInv.amount : 0
          // Optimistic update prevention: ensure we don't go below 0
          if (currentAmount < cost.amount) throw new Error('Not enough materials')
          await window.api.inventory.update(cost.itemId, currentAmount - cost.amount)
        }
      }

      // 2. Add results
      const results = activeCraft.results.filter((r) => r.type === resultType)
      for (const res of results) {
        const currentInv = inventory.find((i) => i.itemId === res.itemId)
        const currentAmount = currentInv ? currentInv.amount : 0
        await window.api.inventory.update(res.itemId, currentAmount + res.amount)
      }

      await queryClient.invalidateQueries({ queryKey: ['inventory'] })

      if (resultType === 'success') {
        toast.success('Craft Successful')
      } else {
        toast.error('Craft Failed')
      }
    } catch (e) {
      toast.error('Crafting interrupted')
      console.error(e)
    } finally {
      setIsCraftModalOpen(false)
    }
  }

  // Derived State
  const uniqueRecipeCategories = useMemo(
    () => Array.from(new Set(recipes.map((r) => r.category || 'General'))),
    [recipes]
  )

  return (
    <div className="w-full">
      <div className="px-4 md:px-6 pt-4 md:pt-6">
        <h1 className="mb-4 scroll-m-20 text-2xl font-extrabold tracking-tight text-balance">
          Crafting Table
        </h1>

        <div className="flex flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <CraftingToolbar />
        </div>
      </div>

      <div className="flex-1 overflow-hidden px-4 md:px-6 pb-6">
        <CraftingSplitView
          inventory={inventory}
          items={items}
          onEditRecipe={(r) => {
            setEditingRecipe(r)
            setIsRecipeModalOpen(true)
          }}
          onDeleteRecipe={handleDeleteRecipe}
        />
      </div>

      {/* Recipe Modal */}
      <Dialog open={isRecipeModalOpen} onOpenChange={setIsRecipeModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRecipe?.id === 0 ? 'New Recipe' : 'Edit Recipe'}</DialogTitle>
            <DialogDescription>
              Configure ingredients and results for this recipe.
            </DialogDescription>
          </DialogHeader>
          {editingRecipe && (
            <CraftingForm
              initialData={editingRecipe}
              items={items}
              categories={uniqueRecipeCategories}
              onSave={handleRecipeSaved}
              onCancel={() => setIsRecipeModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Crafting Confirmation Modal */}
      <Dialog open={isCraftModalOpen} onOpenChange={setIsCraftModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Crafting</DialogTitle>
            <DialogDescription>{activeCraft?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted/50 p-4 rounded-lg text-center mb-4">
              <p className="text-sm text-muted-foreground">Simulation Mode: Choose outcome</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="bg-red-500/10 hover:bg-red-500/20 p-4 rounded-xl border border-red-500/20 text-center cursor-pointer group flex flex-col items-center justify-center gap-2 transition-colors"
                onClick={() => handleCraftAction('fail')}
              >
                <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-sm text-red-500 mb-1">
                  <XCircle size={20} />
                </div>
                <span className="text-sm font-bold text-red-600">Force Fail</span>
              </div>
              <div
                className="bg-green-500/10 hover:bg-green-500/20 p-4 rounded-xl border border-green-500/20 text-center cursor-pointer group flex flex-col items-center justify-center gap-2 transition-colors"
                onClick={() => handleCraftAction('success')}
              >
                <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-sm text-green-500 mb-1">
                  <CheckCircle size={20} />
                </div>
                <span className="text-sm font-bold text-green-600">Force Success</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
