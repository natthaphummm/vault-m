import { Trash2, Plus } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Item, CraftingRecipe, CraftingRecipeSchema } from '../../types'
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

export const CraftingForm = ({
  initialData,
  items,
  categories,
  onSave,
  onCancel
}: {
  initialData: CraftingRecipe
  items: Item[]
  categories: string[]
  onSave: () => void
  onCancel: () => void
}) => {
  const queryClient = useQueryClient()

  const saveMutation = useMutation({
    mutationFn: async (data: CraftingRecipe) => {
      return await window.api.crafting.save(data)
    },
    onSuccess: () => {
      toast.success(initialData.id ? 'Recipe updated' : 'Recipe created')
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      onSave()
    },
    onError: (err) => {
      console.error(err)
      toast.error('Failed to save recipe')
    }
  })

  const form = useForm({
    defaultValues: initialData,
    validators: {
      onChange: CraftingRecipeSchema
    },
    onSubmit: async ({ value }) => {
      saveMutation.mutate(value)
    }
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-6 py-2"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Recipe Name</Label>
          <form.Field
            name="name"
            children={(field) => (
              <>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Iron Sword"
                />
                {field.state.meta.errors ? (
                  <em role="alert" className="text-destructive text-xs">
                    {field.state.meta.errors.join(', ')}
                  </em>
                ) : null}
              </>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <div className="relative">
            <form.Field
              name="category"
              children={(field) => (
                <>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    list="recipe-categories-list"
                    placeholder="General"
                  />
                  {field.state.meta.errors ? (
                    <em role="alert" className="text-destructive text-xs">
                      {field.state.meta.errors.join(', ')}
                    </em>
                  ) : null}
                </>
              )}
            />
            <datalist id="recipe-categories-list">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="col-span-2 space-y-2">
          <form.Field
            name="successChance"
            children={(field) => (
              <>
                <div className="flex justify-between">
                  <Label>Success Chance: {field.state.value}%</Label>
                </div>
                <Input
                  type="range"
                  min="1"
                  max="100"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                />
              </>
            )}
          />
        </div>
      </div>

      {/* Ingredients */}
      <Card>
        <div className="p-3 border-b flex justify-between items-center bg-muted/30">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Ingredients
          </h4>
          <form.Field
            name="costs"
            mode="array"
            children={(field) => (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() =>
                  field.pushValue({ itemId: items[0]?.id || 0, amount: 1, remove: true })
                }
              >
                <Plus size={14} className="mr-1" /> Add
              </Button>
            )}
          />
        </div>
        <CardContent className="p-3 space-y-2">
          <form.Field
            name="costs"
            mode="array"
            children={(field) => {
              if (field.state.value.length === 0) {
                return (
                  <div className="text-center text-sm text-muted-foreground py-2">
                    No ingredients required
                  </div>
                )
              }
              return field.state.value.map((_, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <form.Field
                    name={`costs[${idx}].itemId`}
                    children={(subField) => (
                      <div className="flex-1 min-w-[120px]">
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors md:text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          value={subField.state.value}
                          onChange={(e) => subField.handleChange(Number(e.target.value))}
                        >
                          {items.map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  />
                  <form.Field
                    name={`costs[${idx}].amount`}
                    children={(subField) => (
                      <Input
                        type="number"
                        min="1"
                        className="w-20 text-center"
                        value={subField.state.value}
                        onChange={(e) => subField.handleChange(Number(e.target.value))}
                      />
                    )}
                  />
                  <form.Field
                    name={`costs[${idx}].remove`}
                    children={(subField) => (
                      <div className="flex items-center space-x-2 border rounded-md px-3 h-9 bg-muted/20">
                        <Checkbox
                          id={`consume-${idx}`}
                          checked={subField.state.value}
                          onCheckedChange={(checked) => subField.handleChange(checked === true)}
                        />
                        <label
                          htmlFor={`consume-${idx}`}
                          className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                        >
                          {subField.state.value ? 'Consume' : 'Keep'}
                        </label>
                      </div>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => field.removeValue(idx)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            }}
          />
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <div className="p-3 border-b flex justify-between items-center bg-muted/30">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Results
          </h4>
          <form.Field
            name="results"
            mode="array"
            children={(field) => (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() =>
                  field.pushValue({ itemId: items[0]?.id || 0, amount: 1, type: 'success' })
                }
              >
                <Plus size={14} className="mr-1" /> Add
              </Button>
            )}
          />
        </div>
        <CardContent className="p-3 space-y-2">
          <form.Field
            name="results"
            mode="array"
            children={(field) => {
              if (field.state.value.length === 0) {
                return (
                  <div className="text-center text-sm text-muted-foreground py-2">
                    No results configured
                  </div>
                )
              }
              return field.state.value.map((_, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <form.Field
                    name={`results[${idx}].type`}
                    children={(subField) => (
                      <Select
                        value={subField.state.value}
                        onValueChange={(val) => subField.handleChange(val as 'success' | 'fail')}
                      >
                        <SelectTrigger
                          className={`w-32 ${subField.state.value === 'success' ? 'text-green-600 font-bold' : 'text-destructive font-bold'}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="fail">Fail</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <form.Field
                    name={`results[${idx}].itemId`}
                    children={(subField) => (
                      <div className="flex-1 min-w-[120px]">
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors md:text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          value={subField.state.value}
                          onChange={(e) => subField.handleChange(Number(e.target.value))}
                        >
                          {items.map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  />
                  <form.Field
                    name={`results[${idx}].amount`}
                    children={(subField) => (
                      <Input
                        type="number"
                        min="1"
                        className="w-20 text-center"
                        value={subField.state.value}
                        onChange={(e) => subField.handleChange(Number(e.target.value))}
                      />
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => field.removeValue(idx)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            }}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? 'Saving...' : 'Save Recipe'}
            </Button>
          )}
        />
      </div>
    </form>
  )
}
