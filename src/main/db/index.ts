
import { app } from 'electron';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { join } from 'path';
import { existsSync, copyFileSync, mkdirSync } from 'fs';
import * as schema from './schema';

import { is } from '@electron-toolkit/utils';

let dbPath: string;

if (is.dev) {
    dbPath = join(process.cwd(), 'resources/sqlite.db');
} else {
    const userDataPath = app.getPath('userData');
    dbPath = join(userDataPath, 'database.sqlite');

    // Ensure userData directory exists (it should, but good practice)
    if (!existsSync(userDataPath)) {
        mkdirSync(userDataPath, { recursive: true });
    }

    // Copy template database if it doesn't exist
    if (!existsSync(dbPath)) {
        // In production, extraResources are unpacked to resources/ in the app installation
        const templateDbPath = join(process.resourcesPath, 'sqlite.db');
        try {
            if (existsSync(templateDbPath)) {
                copyFileSync(templateDbPath, dbPath);
            } else {
                // Fallback or error handling if template is missing (should verify build config)
                console.error('Template database not found at:', templateDbPath);
            }
        } catch (error) {
            console.error('Failed to copy database template:', error);
        }
    }
}

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
