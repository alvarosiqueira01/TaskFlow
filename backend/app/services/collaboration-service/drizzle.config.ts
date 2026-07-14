import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Load the local .env file for the specific service
config({ path: '.env' });

export default defineConfig({
  schema: './src/infrastructure/database/drizzle/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});