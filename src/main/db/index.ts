import { app } from 'electron'
import fs from 'fs'
import { join } from 'path'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'

let dbPath: string

if (app.isPackaged) {
    dbPath = join(app.getPath('userData'), 'database.db')
    const sourcePath = join(process.resourcesPath, 'prod.db')

    if (!fs.existsSync(dbPath)) {
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, dbPath)
        }
    }
} else {
    dbPath = './resources/dev.db'
}

const sqlite = new Database(dbPath)
export const db = drizzle(sqlite, { schema })
