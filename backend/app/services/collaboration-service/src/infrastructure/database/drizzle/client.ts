import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

export type DrizzleClient = NodePgDatabase<typeof schema>;

export function createDrizzleClient(databaseUrl: string): DrizzleClient {
  const pool = new Pool({ connectionString: databaseUrl });
  return drizzle(pool, { schema });
}
