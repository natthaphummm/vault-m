export function createApi(ipc: Pick<Electron.IpcRenderer, 'invoke'>) {
    return {
        items: {
            getAll: () => ipc.invoke('items:get-all'),
            save: (item: any) => ipc.invoke('items:save', item),
            delete: (id: number) => ipc.invoke('items:delete', id)
        },
        inventory: {
            getAll: () => ipc.invoke('inventory:get-all'),
            update: (itemId: number, amount: number) =>
                ipc.invoke('inventory:update', { itemId, amount })
        },
        crafting: {
            getAll: () => ipc.invoke('crafting:get-all'),
            save: (recipe: any) => ipc.invoke('crafting:save', recipe),
            delete: (id: number) => ipc.invoke('crafting:delete', id)
        },
        app: {
            getVersion: () => ipc.invoke('app:get-version'),
            checkUpdate: () => ipc.invoke('app:check-update')
        }
    }
}