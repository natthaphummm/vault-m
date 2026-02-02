import * as z from 'zod'

export const ItemFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().min(0, 'Price must be at least 0'),
    amount: z.number().min(0),
    category: z.string().min(1, 'Category is required'),
    image: z.string()
})

export type ItemForm = z.infer<typeof ItemFormSchema>

export const CraftingCostSchema = z.object({
    itemId: z.number().min(1, 'Item is required'),
    amount: z.number().min(1, 'Amount must be at least 1'),
    remove: z.boolean()
})

export const CraftingResultSchema = z.object({
    itemId: z.number().min(1, 'Item is required'),
    amount: z.number().min(1, 'Amount must be at least 1'),
    type: z.enum(['success', 'fail'])
})

export const CraftingRecipeSchema = z.object({
    id: z.number(),
    name: z.string().min(1, 'Name is required'),
    category: z.string().min(1, 'Category is required'),
    successChance: z.number().min(1).max(100),
    costs: z.array(CraftingCostSchema),
    results: z.array(CraftingResultSchema)
})

export type CraftingRecipeFormState = z.infer<typeof CraftingRecipeSchema>

// Deprecated aliases for backward compatibility
export const RecipeSchema = CraftingRecipeSchema
export type RecipeFormState = CraftingRecipeFormState

export interface Item {
    id: number;
    name: string;
    price: number;
    category: string;
    image?: string;
    amount?: number;
}

export interface InventoryItem {
    itemId: number;
    amount: number;
}

export interface CraftingCost {
    itemId: number;
    amount: number;
    remove: boolean;
}

export interface CraftingResult {
    itemId: number;
    amount: number;
    type: 'success' | 'fail';
}

export interface CraftingRecipe {
    id: number;
    name: string;
    category: string;
    successChance: number;
    costs: CraftingCost[];
    results: CraftingResult[];
}

export type Recipe = CraftingRecipe;