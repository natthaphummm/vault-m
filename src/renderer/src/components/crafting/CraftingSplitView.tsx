import { useMemo } from 'react'
import {
  Hammer,
  ChevronRight,
  Edit,
  Trash2,
  Zap,
  Anchor,
  XCircle,
  ArrowLeft,
  Settings
} from 'lucide-react'
import type { Item, Recipe, InventoryItem } from '@/types'

import { CraftingItemRow } from './CraftingItemRow'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Item as ItemComp,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from '@/components/ui/item'

import { cn } from '@/lib/utils'
import { useCraftingStore } from '@/store/useCraftingStore'

export const CraftingSplitView = ({
  inventory,
  items,
  onEditRecipe,
  onDeleteRecipe
}: {
  inventory: InventoryItem[]
  items: Item[]
  onEditRecipe: (r: Recipe) => void
  onDeleteRecipe: (id: number) => void
}) => {
  // Global Store
  const { recipes, selectedRecipe, setSelectedRecipe, filterCategory, openCraftModal } =
    useCraftingStore()

  // Helpers
  const getItem = (id: number) => items.find((i) => i.id === id)
  const getItemPrice = (id: number) => getItem(id)?.price || 0

  // Computed
  const filteredRecipes = useMemo(
    () => recipes.filter((r) => filterCategory === 'All' || r.category === filterCategory),
    [recipes, filterCategory]
  )
  const canCraft = selectedRecipe
    ? selectedRecipe.costs.every((cost) => {
        const invItem = inventory.find((i) => i.itemId === cost.itemId)
        return (invItem?.amount || 0) >= cost.amount
      })
    : false
  const totalCost = selectedRecipe
    ? selectedRecipe.costs.reduce((sum, cost) => sum + getItemPrice(cost.itemId) * cost.amount, 0)
    : 0
  const successResult = selectedRecipe?.results.find((r) => r.type === 'success')
  const resultItem = successResult ? getItem(successResult.itemId) : null

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Panel: Recipe List */}
      <Card className="w-full lg:w-80 flex flex-col overflow-hidden border-border/50 shadow-sm">
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {filteredRecipes.map((recipe) => {
              const resItem = recipe.results.find((r) => r.type === 'success')
                ? getItem(recipe.results.find((r) => r.type === 'success')!.itemId)
                : null
              const isSelected = selectedRecipe?.id === recipe.id
              return (
                <ItemComp
                  key={recipe.id}
                  variant={isSelected ? 'muted' : 'outline'}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="cursor-pointer"
                >
                  <ItemMedia>
                    {resItem?.image ? (
                      <img src={resItem.image} className="size-6 object-contain" />
                    ) : (
                      <Hammer className="size-6" />
                    )}
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{recipe.name}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRight size={16} />
                  </ItemActions>
                </ItemComp>
              )
            })}
            {filteredRecipes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">No recipes found</div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Right Panel: Workspace */}
      <Card className="flex-1 border-border/50 shadow-sm relative flex flex-col overflow-hidden">
        {selectedRecipe && resultItem ? (
          <div className="flex flex-col h-full">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setSelectedRecipe(null)}
              >
                <ArrowLeft size={18} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onEditRecipe(selectedRecipe)}>
                <Edit size={18} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDeleteRecipe(selectedRecipe.id)}
              >
                <Trash2 size={18} />
              </Button>
            </div>

            <div className="flex flex-col lg:flex-row h-full">
              {/* Details Column */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 border-b lg:border-b-0 lg:border-r bg-gradient-to-b from-background to-muted/20">
                <div className="relative group mb-8">
                  <div className="w-48 h-48 bg-card border rounded-3xl flex items-center justify-center relative shadow-lg">
                    {resultItem.image ? (
                      <img src={resultItem.image} className="w-32 h-32 object-contain" />
                    ) : (
                      <Hammer size={64} className="text-muted-foreground" />
                    )}
                    <Badge className="absolute -bottom-3 text-sm px-2 py-0.5">
                      x{successResult?.amount || 1}
                    </Badge>
                  </div>
                </div>

                <h2 className="text-2xl font-black mb-6 text-center tracking-tight">
                  {selectedRecipe.name}
                </h2>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  <Badge
                    variant="outline"
                    className="gap-1.5 py-1 px-3 bg-green-500/10 text-green-700 border-green-200 hover:bg-green-500/10"
                  >
                    <Zap size={14} /> {selectedRecipe.successChance}% Success
                  </Badge>
                  <Badge
                    variant="outline"
                    className="gap-1.5 py-1 px-3 bg-amber-500/10 text-amber-700 border-amber-200 hover:bg-amber-500/10"
                  >
                    <Anchor size={14} /> Cost: ${totalCost.toLocaleString()}
                  </Badge>
                </div>

                <Button
                  size="lg"
                  className={cn(
                    'w-full max-w-xs font-bold uppercase tracking-wider gap-2',
                    canCraft ? 'animate-pulse-slow' : 'opacity-80'
                  )}
                  data-testid="craft-button"
                  disabled={!canCraft}
                  onClick={() => openCraftModal(selectedRecipe)}
                >
                  {canCraft ? <Hammer size={18} /> : <XCircle size={18} />}
                  {canCraft ? 'Craft Item' : 'Missing Materials'}
                </Button>
              </div>

              {/* Ingredients Column */}
              <div className="flex-1 flex flex-col bg-muted/10">
                <div className="p-4 border-b bg-background">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    Required Materials
                  </h4>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-2">
                    {selectedRecipe.costs.map((cost, idx) => {
                      const item = getItem(cost.itemId)
                      const invItem = inventory.find((i) => i.itemId === cost.itemId)
                      return (
                        <CraftingItemRow
                          key={idx}
                          item={item}
                          requiredAmount={cost.amount}
                          inventoryAmount={invItem?.amount || 0}
                          remove={cost.remove}
                        />
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <div className="mb-4 p-6 bg-muted/50 rounded-full border border-border">
              <Settings size={48} className="opacity-50" />
            </div>
            <p className="text-sm font-medium">Select a recipe to start crafting</p>
          </div>
        )}
      </Card>
    </div>
  )
}
