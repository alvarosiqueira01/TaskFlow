import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Busca varrendo todos os serviços e assumindo os schemas
  schema: './app/services/*/src/infrastructure/database/drizzle/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});