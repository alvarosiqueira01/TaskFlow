import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export type DrizzleClient = NodePgDatabase<typeof schema>;

export function createDrizzleClient(connectionString: string): { db: DrizzleClient; pool: Pool } {
  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
  });

  const db = drizzle(pool, { schema });

  return { db, pool };
}
