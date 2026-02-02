import { ipcMain } from 'electron'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { items, inventory } from '../db/schema'

export function registerItemsHandlers(): void {
    ipcMain.handle('items:get-all', async () => {
        try {
            return await db.select().from(items)
        } catch (e) {
            console.error('Failed to get items:', e)
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
}
