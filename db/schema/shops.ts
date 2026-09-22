import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  uuid,
  jsonb,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { usersSync } from "./auth";

export const onboardingStepEnum = pgEnum("onboarding_step", [
  "shop_details",
  "category",
  "first_product",
  "completed",
]);

export const shopStatusEnum = pgEnum("shop_status", ["active", "suspended"]);

export const merchants = pgTable(
  "merchants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => usersSync.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("merchants_self", {
      for: "all",
      using: sql`${table.userId} = current_setting('app.user_id', true)::uuid`,
      withCheck: sql`${table.userId} = current_setting('app.user_id', true)::uuid`,
    }),
  ],
).enableRLS();

export const shopCategories = pgTable("shop_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const shops = pgTable(
  "shops",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    merchantId: uuid("merchant_id")
      .notNull()
      .unique()
      .references(() => merchants.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    username: text("username").notNull().unique(),
    gstin: text("gstin").notNull(),
    categoryId: uuid("category_id").references(() => shopCategories.id),
    logoUrl: text("logo_url"),
    description: text("description"),
    bannerUrls: jsonb("banner_urls").$type<string[]>().notNull().default([]),
    bannerVideoUrl: text("banner_video_url"),
    accentColor: text("accent_color"),
    onboardingStep: onboardingStepEnum("onboarding_step")
      .notNull()
      .default("shop_details"),
    status: shopStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("shops_owner", {
      for: "all",
      using: sql`${table.merchantId} in (select id from merchants where user_id = current_setting('app.user_id', true)::uuid)`,
      withCheck: sql`${table.merchantId} in (select id from merchants where user_id = current_setting('app.user_id', true)::uuid)`,
    }),
    pgPolicy("shops_public_read", {
      for: "select",
      using: sql`${table.status} = 'active'`,
    }),
  ],
).enableRLS();
