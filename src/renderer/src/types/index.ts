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