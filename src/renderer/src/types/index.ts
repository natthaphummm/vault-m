import * as z from 'zod'

export const ItemFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().min(0, 'Price must be at least 0'),
    amount: z.number().min(0),
    category: z.string().min(1, 'Category is required'),
    image: z.string()
})

export type ItemForm = z.infer<typeof ItemFormSchema>

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

export interface Recipe {
    id: number;
    name: string;
    category: string;
    successChance: number;
    costs: CraftingCost[];
    results: CraftingResult[];
}