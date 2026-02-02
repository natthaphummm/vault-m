import { ipcMain } from 'electron'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { inventory } from '../db/schema'

export function registerInventoryHandlers(): void {
    ipcMain.handle('inventory:get-all', async () => {
        try {
            return await db.select().from(inventory)
        } catch (e) {
            console.error('Failed to get inventory:', e)
            return []
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
}
