import * as z from 'zod'

// --- Database Schemas ---

export const ItemSchema = z.object({
    id: z.number(),
    name: z.string().min(1, 'Name is required'),
    price: z.number().min(0, 'Price must be at least 0'),
    category: z.string().min(1, 'Category is required'),
    image: z.string().nullable()
})

export const InventorySchema = z.object({
    itemId: z.number(),
    amount: z.number()
})

export const CraftingSchema = z.object({
    id: z.number(),
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    successChance: z.number().min(1).max(100)
})

export const CraftingCostsSchema = z.object({
    id: z.number(),
    craftingId: z.number(),
    itemId: z.number().min(1, 'Item is required'),
    amount: z.number().min(1, 'Amount must be at least 1'),
    remove: z.boolean()
})

export const CraftingResultsSchema = z.object({
    id: z.number(),
    craftingId: z.number(),
    itemId: z.number().min(1, 'Item is required'),
    amount: z.number().min(1, 'Amount must be at least 1'),
    type: z.enum(['success', 'fail'])
})

// --- Types from DB Schemas ---
export type Item = z.infer<typeof ItemSchema>
export type InventoryItem = z.infer<typeof InventorySchema>
export type Crafting = z.infer<typeof CraftingSchema>
export type CraftingCost = z.infer<typeof CraftingCostsSchema>
export type CraftingResult = z.infer<typeof CraftingResultsSchema>

// --- Form & Composite Schemas (UI Layer) ---

// Form Item Schema (mostly same as DB but id/image optional for new items)
export const ItemFormSchema = ItemSchema.extend({
    id: z.number(),
    amount: z.number().min(0) // helper for UI
})

export type ItemForm = z.infer<typeof ItemFormSchema>

// Costs in the form might not have IDs yet (newly added rows)
export const CraftingCostSchema = CraftingCostsSchema.omit({ id: true, craftingId: true }).extend({
    id: z.number().optional(),
    craftingId: z.number().optional()
})

// Results in the form might not have IDs yet
export const CraftingResultSchema = CraftingResultsSchema.omit({ id: true, craftingId: true }).extend({
    id: z.number().optional(),
    craftingId: z.number().optional()
})

// The aggregate Recipe object used in the UI
export const CraftingRecipeSchema = CraftingSchema.extend({
    costs: z.array(CraftingCostSchema),
    results: z.array(CraftingResultSchema)
})

export type CraftingRecipe = z.infer<typeof CraftingRecipeSchema>