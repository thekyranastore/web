import { sql } from "drizzle-orm";
import { db } from "@/db";

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * Every tenant-owned table (merchants, shops, products, orders, order_items,
 * payout_accounts, delivery_configs) has row-level security enforced via
 * FORCE ROW LEVEL SECURITY, keyed on the Postgres session vars `app.user_id`
 * / `app.shop_id`. Those vars only survive for the lifetime of a single
 * transaction over the neon-http driver, so any owner-scoped read or write
 * must happen inside one of these wrappers — never against the bare `db`.
 */
export async function withUserScope<T>(userId: string, fn: (tx: Tx) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.user_id', ${userId}, true)`);
    return fn(tx);
  });
}

export async function withShopScope<T>(shopId: string, fn: (tx: Tx) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.shop_id', ${shopId}, true)`);
    return fn(tx);
  });
}
