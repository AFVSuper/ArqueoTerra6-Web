import "server-only";

import { getConnectionString } from "@netlify/database";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let pool: Pool | null = null;
let database: ReturnType<typeof drizzle<typeof schema>> | null = null;

function connectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  return getConnectionString();
}

export function getDb() {
  if (!database) {
    pool = new Pool({ connectionString: connectionString() });
    database = drizzle(pool, { schema });
  }
  return database;
}
