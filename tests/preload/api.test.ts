import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createApi } from '../../src/preload/api'

describe('preload api', () => {
    let ipcInvokeMock: ReturnType<typeof vi.fn>
    let api: ReturnType<typeof createApi>

    beforeEach(() => {
        ipcInvokeMock = vi.fn()
        api = createApi({ invoke: ipcInvokeMock })
    })

    describe('items', () => {
        it('getAll should call correct ipc channel', async () => {
            ipcInvokeMock.mockResolvedValueOnce([])

            const result = await api.items.getAll()

            expect(ipcInvokeMock).toHaveBeenCalledWith('items:get-all')
            expect(result).toEqual([])
        })

        it('save should pass item payload', async () => {
            const item = { id: 1, name: 'Iron' }

            await api.items.save(item)

            expect(ipcInvokeMock).toHaveBeenCalledWith(
                'items:save',
                item
            )
        })

        it('delete should pass id', async () => {
            await api.items.delete(5)

            expect(ipcInvokeMock).toHaveBeenCalledWith(
                'items:delete',
                5
            )
        })
    })

    describe('inventory', () => {
        it('getAll should call inventory:get-all', async () => {
            await api.inventory.getAll()
            expect(ipcInvokeMock).toHaveBeenCalledWith('inventory:get-all')
        })

        it('update should send itemId and amount', async () => {
            await api.inventory.update(10, 3)

            expect(ipcInvokeMock).toHaveBeenCalledWith(
                'inventory:update',
                { itemId: 10, amount: 3 }
            )
        })
    })

    describe('crafting', () => {
        it('getAll should call crafting:get-all', async () => {
            await api.crafting.getAll()

            expect(ipcInvokeMock).toHaveBeenCalledWith(
                'crafting:get-all'
            )
        })

        it('save should pass recipe payload', async () => {
            const recipe = { id: 1, name: 'Sword' }
            await api.crafting.save(recipe)
            expect(ipcInvokeMock).toHaveBeenCalledWith('crafting:save', recipe)
        })
    })

    describe('error handling', () => {
        it('should propagate ipc errors', async () => {
            const error = new Error('IPC Failed')
            ipcInvokeMock.mockRejectedValue(error)

            await expect(api.items.getAll()).rejects.toThrow('IPC Failed')
        })
    })
})
