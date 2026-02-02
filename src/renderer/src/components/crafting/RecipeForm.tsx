import { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { Item, Recipe } from '../../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export const RecipeForm = ({
  initialData,
  items,
  categories,
  onSave,
  onCancel
}: {
  initialData: Recipe
  items: Item[]
  categories: string[]
  onSave: (r: Recipe) => void
  onCancel: () => void
}) => {
  const [recipe, setRecipe] = useState<Recipe>(initialData)

  const updateList = <T extends object>(
    list: T[],
    idx: number,
    field: keyof T,
    value: any,
    setter: (newList: T[]) => void
  ) => {
    const newList = [...list]
    newList[idx] = { ...newList[idx], [field]: value }
    setter(newList)
  }

  return (
    <div className="space-y-6 py-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Recipe Name</Label>
          <Input
            value={recipe.name}
            onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
            placeholder="e.g. Iron Sword"
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <div className="relative">
            <Input
              value={recipe.category}
              onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}
              list="recipe-categories-list"
              placeholder="General"
            />
            <datalist id="recipe-categories-list">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="col-span-2 space-y-2">
          <div className="flex justify-between">
            <Label>Success Chance: {recipe.successChance}%</Label>
          </div>
          <Input
            type="range"
            min="1"
            max="100"
            value={recipe.successChance}
            onChange={(e) => setRecipe({ ...recipe, successChance: Number(e.target.value) })}
          />
        </div>
      </div>

      {/* Ingredients */}
      <Card>
        <div className="p-3 border-b flex justify-between items-center bg-muted/30">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Ingredients
          </h4>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() =>
              setRecipe({
                ...recipe,
                costs: [...recipe.costs, { itemId: items[0]?.id || 0, amount: 1, remove: true }]
              })
            }
          >
            <Plus size={14} className="mr-1" /> Add
          </Button>
        </div>
        <CardContent className="p-3 space-y-2">
          {recipe.costs.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-2">
              No ingredients required
            </div>
          )}
          {recipe.costs.map((cost, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <div className="flex-1 min-w-[120px]">
                {/* Custom Item Select using native select for performance inside lists or could upgrade to Combobox */}
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors md:text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={cost.itemId}
                  onChange={(e) =>
                    updateList(recipe.costs, idx, 'itemId', Number(e.target.value), (c) =>
                      setRecipe({ ...recipe, costs: c })
                    )
                  }
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                type="number"
                min="1"
                className="w-20 text-center"
                value={cost.amount}
                onChange={(e) =>
                  updateList(recipe.costs, idx, 'amount', Number(e.target.value), (c) =>
                    setRecipe({ ...recipe, costs: c })
                  )
                }
              />
              <div className="flex items-center space-x-2 border rounded-md px-3 h-9 bg-muted/20">
                <Checkbox
                  id={`consume-${idx}`}
                  checked={cost.remove}
                  onCheckedChange={(checked) =>
                    updateList(recipe.costs, idx, 'remove', checked === true, (c) =>
                      setRecipe({ ...recipe, costs: c })
                    )
                  }
                />
                <label
                  htmlFor={`consume-${idx}`}
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                >
                  {cost.remove ? 'Consume' : 'Keep'}
                </label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                onClick={() =>
                  setRecipe({ ...recipe, costs: recipe.costs.filter((_, i) => i !== idx) })
                }
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <div className="p-3 border-b flex justify-between items-center bg-muted/30">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Results
          </h4>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() =>
              setRecipe({
                ...recipe,
                results: [
                  ...recipe.results,
                  { itemId: items[0]?.id || 0, amount: 1, type: 'success' }
                ]
              })
            }
          >
            <Plus size={14} className="mr-1" /> Add
          </Button>
        </div>
        <CardContent className="p-3 space-y-2">
          {recipe.results.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-2">
              No results configured
            </div>
          )}
          {recipe.results.map((res, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <Select
                value={res.type}
                onValueChange={(val) =>
                  updateList(recipe.results, idx, 'type', val, (r) =>
                    setRecipe({ ...recipe, results: r })
                  )
                }
              >
                <SelectTrigger
                  className={`w-32 ${res.type === 'success' ? 'text-green-600 font-bold' : 'text-destructive font-bold'}`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="fail">Fail</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex-1 min-w-[120px]">
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors md:text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={res.itemId}
                  onChange={(e) =>
                    updateList(recipe.results, idx, 'itemId', Number(e.target.value), (r) =>
                      setRecipe({ ...recipe, results: r })
                    )
                  }
                >
                  {items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                type="number"
                min="1"
                className="w-20 text-center"
                value={res.amount}
                onChange={(e) =>
                  updateList(recipe.results, idx, 'amount', Number(e.target.value), (r) =>
                    setRecipe({ ...recipe, results: r })
                  )
                }
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                onClick={() =>
                  setRecipe({ ...recipe, results: recipe.results.filter((_, i) => i !== idx) })
                }
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(recipe)}>Save Recipe</Button>
      </div>
    </div>
  )
}
