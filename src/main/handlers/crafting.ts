import { ipcMain } from 'electron'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { crafting, recipeCosts, recipeResults } from '../db/schema'

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
