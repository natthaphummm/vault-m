import { app, ipcMain } from 'electron'

export function registerAppHandlers(): void {
    ipcMain.handle('app:get-version', () => {
        return app.getVersion()
    })

    ipcMain.handle('app:check-update', async () => {
        // Placeholder for update check logic.
        // In a real app, you'd use electron-updater here.
        // For now, we simulate a check.
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return { updateAvailable: false, message: 'App is up to date' }
    })
}
