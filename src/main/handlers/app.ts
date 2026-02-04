import { app, ipcMain, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'

export function registerAppHandlers(): void {
    ipcMain.handle('app:get-version', () => {
        return app.getVersion()
    })

    // Check for updates
    ipcMain.handle('app:check-update', async () => {
        try {
            autoUpdater.autoDownload = false
            const result = await autoUpdater.checkForUpdates()

            // If result is null, it means we might be in dev mode or something else is wrong,
            // but strictly speaking checkForUpdates returns null if there's no update *available* 
            // in some versions or context. However, conventionally we look at updateInfo.

            // Note: autoUpdater emits 'update-available' or 'update-not-available'
            // We can rely on the returned Promise result for the immediate check status.

            if (result && result.updateInfo.version !== app.getVersion()) {
                return {
                    updateAvailable: true,
                    version: result.updateInfo.version,
                    releaseDate: result.updateInfo.releaseDate,
                    notes: typeof result.updateInfo.releaseNotes === 'string'
                        ? result.updateInfo.releaseNotes
                        : result.updateInfo.releaseNotes?.map(n => n.note).join('\n')
                }
            } else {
                return { updateAvailable: false }
            }
        } catch (error) {
            console.error('Check update failed:', error)
            throw error // Propagate error to renderer
        }
    })

    // Start downloading the update
    ipcMain.handle('app:start-download', () => {
        autoUpdater.downloadUpdate()
    })

    // Install the update
    ipcMain.handle('app:install-update', () => {
        autoUpdater.quitAndInstall()
    })

    // Listen for autoUpdater events and forward to renderer
    // We need to send these to the specific window or all windows.
    // Ideally, we send to the sender of the check-update, but for simplicity via global events:

    autoUpdater.on('update-available', (_info) => {
        // We can notify renderer proactively if needed, but the 'check-update' response handles the initial affirmative.
        // However, if we utilize auto-check on startup later, this is useful.
        // mainWindow?.webContents.send('update:available', info) 
        // (Assuming we have reference to mainWindow or use helper)
    })

    autoUpdater.on('download-progress', (progressObj) => {
        // Broadcast to all windows or the main focused one
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('update:download-progress', progressObj)
        })
    })

    autoUpdater.on('update-downloaded', (_info) => {
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('update:downloaded')
        })
    })

    autoUpdater.on('error', (err) => {
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('update:error', err.message)
        })
    })
}

