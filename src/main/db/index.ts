
import { app } from 'electron';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { join } from 'path';
import * as schema from './schema';

const dbPath = join(app.getPath('userData'), 'database.sqlite');

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });
