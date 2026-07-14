import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export type DrizzleClient = NodePgDatabase<typeof schema>;

/**
 * Creates a Drizzle client backed by a `pg` connection pool.
 * A single pooled connection is reused across warm Lambda invocations.
 */
export function createDrizzleClient(connectionString: string): DrizzleClient {
  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
  });

  return drizzle(pool, { schema });
}
