import "server-only";

import { getConnectionString } from "@netlify/database";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type Database = ReturnType<typeof drizzle<typeof schema>>;

type DatabaseGlobals = typeof globalThis & {
  arqueoDatabasePool?: Pool;
  arqueoDatabase?: Database;
};

const databaseGlobals = globalThis as DatabaseGlobals;

function resolveConnectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  return getConnectionString();
}

export function getDb(): Database {
  if (!databaseGlobals.arqueoDatabase) {
    const pool =
      databaseGlobals.arqueoDatabasePool ??
      new Pool({
        connectionString: resolveConnectionString(),
        max: 3,
        idleTimeoutMillis: 10_000,
        connectionTimeoutMillis: 10_000,
      });

    databaseGlobals.arqueoDatabasePool = pool;
    databaseGlobals.arqueoDatabase = drizzle(pool, { schema });
  }

  return databaseGlobals.arqueoDatabase;
}
