
import { describe, it, expect, beforeEach } from 'vitest';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../src/main/db/schema';
import { eq } from 'drizzle-orm';

describe('Database Schema', () => {
    let db: ReturnType<typeof drizzle<typeof schema>>;
    let sqlite: Database.Database;

    beforeEach(() => {
        // Use in-memory database for testing
        sqlite = new Database(':memory:');
        db = drizzle(sqlite, { schema });

        // Manually push schema or use migrate if you have migrations
        // Since we don't have migrations generated in the test environment easily, 
        // we can use `db.run` to create tables explicitly OR use `drizzle-kit push` logic if available via API.
        // However, better-sqlite3 doesn't auto-create tables from drizzle schema object alone without migrations.
        // A common workaround for testing without migration files is to use `migrate` if we have the folder, 
        // OR manually create tables matching the schema.

        // For simplicity in this environment, let's use the Drizzle 'push' equivalent if possible, 
        // BUT `migrate` requires a migration folder. 
        // Let's manually define the tables for the test to ensure independence, 
        // OR try to use `drizzle-kit`'s programmatic API if we could, but that's heavy.

        // BETTER APPROACH: Just CREATE TABLE statements matching the schema structure for the test.
        // This validates the schema *concept* but if schema.ts diverges from these create statements, tests might pass falsely.
        // Ideally we should use `drizzle-kit push:sqlite` behavior.

        // Actually, let's try to map the schema to create table statements for the test.

        sqlite.exec(`
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                price INTEGER NOT NULL,
                category TEXT NOT NULL,
                image TEXT
            );
            
            CREATE TABLE IF NOT EXISTS inventory (
                item_id INTEGER PRIMARY KEY REFERENCES items(id),
                amount INTEGER NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS crafting (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                success_chance INTEGER NOT NULL DEFAULT 0
            );
            
            CREATE TABLE IF NOT EXISTS recipe_costs (
                id INTEGER PRIMARY KEY,
                recipe_id INTEGER NOT NULL REFERENCES crafting(id) ON DELETE CASCADE,
                item_id INTEGER NOT NULL REFERENCES items(id),
                amount INTEGER NOT NULL,
                remove INTEGER NOT NULL DEFAULT 1
            );
            
            CREATE TABLE IF NOT EXISTS recipe_results (
                id INTEGER PRIMARY KEY,
                recipe_id INTEGER NOT NULL REFERENCES crafting(id) ON DELETE CASCADE,
                item_id INTEGER NOT NULL REFERENCES items(id),
                amount INTEGER NOT NULL,
                type TEXT NOT NULL
            );
        `);
    });

    it('should create and retrieve an item', async () => {
        const newItem = {
            id: 1,
            name: 'Test Item',
            price: 100,
            category: 'Materials',
            image: ''
        };

        await db.insert(schema.items).values(newItem);
        const result = await db.select().from(schema.items).where(eq(schema.items.id, 1));

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(newItem);
    });

    it('should handle inventory updates with relations', async () => {
        const item = { id: 1, name: 'Wood', price: 10, category: 'Material' };
        await db.insert(schema.items).values(item);

        await db.insert(schema.inventory).values({ itemId: 1, amount: 5 });

        const inv = await db.select().from(schema.inventory).where(eq(schema.inventory.itemId, 1));
        expect(inv[0].amount).toBe(5);

        // Update amount
        await db.update(schema.inventory).set({ amount: 10 }).where(eq(schema.inventory.itemId, 1));
        const updated = await db.select().from(schema.inventory);
        expect(updated[0].amount).toBe(10);
    });

    it('should handle crafting recipes and cascade delete', async () => {
        // Setup Items
        await db.insert(schema.items).values([
            { id: 1, name: 'Wood', price: 5, category: 'Material' },
            { id: 2, name: 'Stick', price: 15, category: 'Weapon' }
        ]);

        // Create Recipe
        const recipeId = 1;
        await db.insert(schema.crafting).values({
            id: recipeId,
            name: 'Craft Stick',
            category: 'Weapons',
            successChance: 100
        });

        // Add Costs & Results
        await db.insert(schema.recipeCosts).values({
            recipeId,
            itemId: 1,
            amount: 2,
            remove: true
        });

        await db.insert(schema.recipeResults).values({
            recipeId,
            itemId: 2,
            amount: 1,
            type: 'success'
        });

        // Verify inserted
        const costs = await db.select().from(schema.recipeCosts).where(eq(schema.recipeCosts.recipeId, recipeId));
        expect(costs).toHaveLength(1);

        // Test Cascade Delete
        // Only works if PRAGMA foreign_keys = ON is set in better-sqlite3, which Drizzle might not enforce by default in specific drivers unless configured.
        sqlite.pragma('foreign_keys = ON');

        await db.delete(schema.crafting).where(eq(schema.crafting.id, recipeId));

        const costsAfterDelete = await db.select().from(schema.recipeCosts).where(eq(schema.recipeCosts.recipeId, recipeId));
        expect(costsAfterDelete).toHaveLength(0);
    });
});
