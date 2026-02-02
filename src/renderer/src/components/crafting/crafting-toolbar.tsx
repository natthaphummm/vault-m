import { Plus, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCraftingStore } from '@/store/useCraftingStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export const CraftingToolbar = () => {
  const { openNewRecipeModal, filterCategory, setFilterCategory, recipes } = useCraftingStore()

  // Derived unique categories
  const uniqueCategories = [
    'All',
    ...Array.from(new Set(recipes.map((r) => r.category || 'General')))
  ]

  return (
    <>
      <Select value={filterCategory} onValueChange={setFilterCategory}>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {uniqueCategories.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button onClick={openNewRecipeModal} variant="outline">
        <Plus size={16} />
        <span className="hidden sm:inline">New Recipe</span>
      </Button>
    </>
  )
}
