import 'dotenv/config'
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/main/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: (process.env.NODE_ENV === 'production' ? './resources/prod.db' : './resources/dev.db'),
  },
});
