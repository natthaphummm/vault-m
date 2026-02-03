import { ipcMain } from 'electron'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { crafting, craftingCosts, craftingResults } from '../db/schema'

export function registerCraftingHandlers(): void {
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
            db.transaction((tx) => {
                const { id, costs, results, ...data } = recipeData

                let recipeId = id;
                if (id) {
                    tx.update(crafting).set(data).where(eq(crafting.id, id)).run();
                    // Clear existing relations to rewrite them (simple approach)
                    tx.delete(craftingCosts).where(eq(craftingCosts.craftingId, id)).run();
                    tx.delete(craftingResults).where(eq(craftingResults.craftingId, id)).run();
                } else {
                    const inserted = tx.insert(crafting).values(data).returning({ id: crafting.id }).get();
                    if (!inserted) throw new Error('Failed to insert recipe');
                    recipeId = inserted.id;
                }

                if (costs && costs.length > 0) {
                    tx.insert(craftingCosts).values(costs.map(c => ({ ...c, craftingId: recipeId }))).run();
                }

                if (results && results.length > 0) {
                    tx.insert(craftingResults).values(results.map(r => ({ ...r, craftingId: recipeId }))).run();
                }
            })
            return true
        } catch (e) {
            console.error('Failed to save crafting recipe:', e)
            throw e
        }
    })
}
