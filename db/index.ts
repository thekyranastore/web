import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";

/**
 * neon-http has no transaction support, which RLS session vars (set_config
 * scoped per-transaction) require. neon-serverless's Pool keeps a real
 * Postgres session alive for db.transaction(), at the cost of one pooled
 * websocket connection instead of a stateless HTTP fetch per query. Node 22+
 * ships a global WebSocket, so no `ws` polyfill is needed here.
 */
const pool = new Pool({ connectionString: process.env.DATABASE_URL!, max: 5 });

export const db = drizzle(pool, { schema });
