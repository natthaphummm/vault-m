import { ipcMain } from 'electron'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { items, inventory, crafting, recipeCosts, recipeResults } from './db/schema'

export function registerHandlers(): void {
    ipcMain.handle('items:get-all', async () => {
        try {
            return await db.select().from(items)
        } catch (e) {
            console.error('Failed to get items:', e)
            return []
        }
    })

    ipcMain.handle('inventory:get-all', async () => {
        try {
            return await db.select().from(inventory)
        } catch (e) {
            console.error('Failed to get inventory:', e)
            return []
        }
    })

    ipcMain.handle('items:save', async (_, item) => {
        try {
            const { id, ...data } = item
            // SQLite conflict update
            await db.insert(items).values(item).onConflictDoUpdate({
                target: items.id,
                set: data
            })
            return true
        } catch (e) {
            console.error('Failed to save item:', e)
            throw e
        }
    })

    ipcMain.handle('items:delete', async (_, id) => {
        try {
            await db.delete(inventory).where(eq(inventory.itemId, id))
            await db.delete(items).where(eq(items.id, id))
            return true
        } catch (e) {
            console.error('Failed to delete item:', e)
            throw e
        }
    })

    ipcMain.handle('inventory:update', async (_, { itemId, amount }) => {
        try {
            if (amount <= 0) {
                await db.delete(inventory).where(eq(inventory.itemId, itemId))
            } else {
                await db
                    .insert(inventory)
                    .values({ itemId, amount })
                    .onConflictDoUpdate({
                        target: inventory.itemId,
                        set: { amount }
                    })
            }
            return true
        } catch (e) {
            console.error('Failed to update inventory:', e)
            throw e
        }
    })

    ipcMain.handle('crafting:get-all', async () => {
        try {
            return await db.query.crafting.findMany({
                with: {
                    costs: true,
                    results: true
                }
            })
        } catch (e) {
            console.error('Failed to get crafting recipes:', e)
            return []
        }
    })

    ipcMain.handle('crafting:save', async (_, recipeData) => {
        try {
            await db.transaction(async (tx) => {
                const { id, costs, results, ...data } = recipeData

                let recipeId = id;
                if (id) {
                    await tx.update(crafting).set(data).where(eq(crafting.id, id));
                    // Clear existing relations to rewrite them (simple approach)
                    await tx.delete(recipeCosts).where(eq(recipeCosts.recipeId, id));
                    await tx.delete(recipeResults).where(eq(recipeResults.recipeId, id));
                } else {
                    const [inserted] = await tx.insert(crafting).values(data).returning({ id: crafting.id });
                    recipeId = inserted.id;
                }

                if (costs && costs.length > 0) {
                    await tx.insert(recipeCosts).values(costs.map(c => ({ ...c, recipeId })));
                }

                if (results && results.length > 0) {
                    await tx.insert(recipeResults).values(results.map(r => ({ ...r, recipeId })));
                }
            })
            return true
        } catch (e) {
            console.error('Failed to save crafting recipe:', e)
            throw e
        }
    })
}
