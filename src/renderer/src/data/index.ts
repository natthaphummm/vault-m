import type { Item, InventoryItem, Recipe } from '@renderer/types'

export const INITIAL_ITEMS: Item[] = [
    { id: 1, name: 'Iron Ore', price: 10, category: 'Material', image: 'https://cdn-icons-png.flaticon.com/512/7043/7043833.png' },
    { id: 2, name: 'Coal', price: 5, category: 'Fuel', image: 'https://cdn-icons-png.flaticon.com/512/2152/2152362.png' },
    { id: 3, name: 'Iron Ingot', price: 30, category: 'Material', image: 'https://cdn-icons-png.flaticon.com/512/7285/7285552.png' },
    { id: 4, name: 'Stick', price: 2, category: 'Material' },
    { id: 5, name: 'Iron Sword', price: 150, category: 'Weapon', image: 'https://cdn-icons-png.flaticon.com/512/1037/1037974.png' },
    { id: 6, name: 'Scrap Metal', price: 1, category: 'Junk' },
    { id: 7, name: 'Money', price: 1, category: 'Money', image: 'https://cdn-icons-png.flaticon.com/512/2489/2489756.png' },
    { id: 8, name: 'Black Money', price: 100, category: 'Money', image: 'https://cdn-icons-png.flaticon.com/512/2150/2150495.png' },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
    { itemId: 1, amount: 20 },
    { itemId: 2, amount: 10 },
    { itemId: 4, amount: 5 },
    { itemId: 7, amount: 100000 },
    { itemId: 8, amount: 5 },
];

export const INITIAL_RECIPES: Recipe[] = [
    {
        id: 1,
        name: 'Smelt Iron Ingot',
        category: 'Refining',
        successChance: 80,
        costs: [
            { itemId: 1, amount: 2, remove: true },
            { itemId: 2, amount: 1, remove: true },
        ],
        results: [
            { itemId: 3, amount: 1, type: 'success' },
            { itemId: 6, amount: 1, type: 'fail' },
        ]
    },
    {
        id: 2,
        name: 'Forge Iron Sword',
        category: 'Weaponsmithing',
        successChance: 50,
        costs: [
            { itemId: 3, amount: 2, remove: true },
            { itemId: 4, amount: 1, remove: true },
        ],
        results: [
            { itemId: 5, amount: 1, type: 'success' },
            { itemId: 6, amount: 2, type: 'fail' },
        ]
    }
];