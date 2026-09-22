import { pgTable, timestamp, pgEnum, uuid, jsonb, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { shops } from "./shops";

export const payoutStatusEnum = pgEnum("payout_status", [
  "not_configured",
  "pending_verification",
  "verified",
]);

export const deliveryProviderEnum = pgEnum("delivery_provider", [
  "none",
  "inhouse",
]);

export const payoutAccounts = pgTable(
  "payout_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shopId: uuid("shop_id")
      .notNull()
      .unique()
      .references(() => shops.id, { onDelete: "cascade" }),
    status: payoutStatusEnum("status").notNull().default("not_configured"),
    bankDetails: jsonb("bank_details"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("payout_accounts_owner", {
      for: "all",
      using: sql`${table.shopId} = current_setting('app.shop_id', true)::uuid`,
      withCheck: sql`${table.shopId} = current_setting('app.shop_id', true)::uuid`,
    }),
  ],
).enableRLS();

export const deliveryConfigs = pgTable(
  "delivery_configs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shopId: uuid("shop_id")
      .notNull()
      .unique()
      .references(() => shops.id, { onDelete: "cascade" }),
    provider: deliveryProviderEnum("provider").notNull().default("none"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("delivery_configs_owner", {
      for: "all",
      using: sql`${table.shopId} = current_setting('app.shop_id', true)::uuid`,
      withCheck: sql`${table.shopId} = current_setting('app.shop_id', true)::uuid`,
    }),
  ],
).enableRLS();
