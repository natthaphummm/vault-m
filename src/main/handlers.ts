import { ipcMain } from 'electron'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { items, inventory } from './db/schema'

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
}
