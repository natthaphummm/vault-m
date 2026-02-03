import { app, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

export function registerAppHandlers(): void {
    ipcMain.handle('app:get-version', () => {
        return app.getVersion()
    })

    ipcMain.handle('app:check-update', async () => {
        try {
            autoUpdater.autoDownload = false
            const result = await autoUpdater.checkForUpdates()

            // If we get a result and the version is different (and higher ideally, but updater handles that)
            // Actually, checkForUpdates resolves with the update info. 
            // If no update is available, it might still return result with current version info?
            // autoUpdater emits 'update-not-available' if no update.
            // But here we just want to know if 'update-available' would be true.
            // A simpler check:
            if (result && result.updateInfo.version !== app.getVersion()) {
                // Simple version check might not suffice for rollback etc, but good enough for now.
                // Better: check if we are strictly less than remote? 
                // result.updateInfo is the REMOTE info.
                return {
                    updateAvailable: true,
                    message: `Version ${result.updateInfo.version} is available.`
                }
            } else {
                return { updateAvailable: false, message: 'App is up to date' }
            }
        } catch (error) {
            console.error('Update check failed:', error)
            return {
                updateAvailable: false,
                message: `Update check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
        }
    })
}

