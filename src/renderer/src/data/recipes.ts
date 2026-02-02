import { Recipe } from '../types';

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
