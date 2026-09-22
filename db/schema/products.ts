import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  uuid,
  integer,
  jsonb,
  pgPolicy,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { shops } from "./shops";

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "active",
  "archived",
]);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    pricePaise: integer("price_paise").notNull(),
    stockQty: integer("stock_qty").notNull().default(0),
    imageUrls: jsonb("image_urls").$type<string[]>().notNull().default([]),
    videoUrl: text("video_url"),
    status: productStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("products_owner", {
      for: "all",
      using: sql`${table.shopId} = current_setting('app.shop_id', true)::uuid`,
      withCheck: sql`${table.shopId} = current_setting('app.shop_id', true)::uuid`,
    }),
    pgPolicy("products_public_read", {
      for: "select",
      using: sql`${table.status} = 'active'`,
    }),
  ],
).enableRLS();
