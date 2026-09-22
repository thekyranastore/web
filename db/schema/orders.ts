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
import { products } from "./products";

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", ["unpaid", "paid"]);

export const deliveryModeEnum = pgEnum("delivery_mode", ["self", "inhouse"]);

export type OrderAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    shopId: uuid("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "restrict" }),
    customerName: text("customer_name").notNull(),
    customerPhone: text("customer_phone").notNull(),
    customerAddress: jsonb("customer_address").$type<OrderAddress>().notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    totalPaise: integer("total_paise").notNull(),
    paymentStatus: paymentStatusEnum("payment_status").notNull().default("unpaid"),
    deliveryMode: deliveryModeEnum("delivery_mode").notNull().default("self"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    pgPolicy("orders_owner", {
      for: "all",
      using: sql`${table.shopId} = current_setting('app.shop_id', true)::uuid`,
      withCheck: sql`${table.shopId} = current_setting('app.shop_id', true)::uuid`,
    }),
    pgPolicy("orders_public_insert", {
      for: "insert",
      withCheck: sql`${table.shopId} in (select id from shops where status = 'active')`,
    }),
  ],
).enableRLS();

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    pricePaise: integer("price_paise").notNull(),
  },
  (table) => [
    pgPolicy("order_items_owner", {
      for: "all",
      using: sql`${table.orderId} in (select id from orders where shop_id = current_setting('app.shop_id', true)::uuid)`,
      withCheck: sql`${table.orderId} in (select id from orders where shop_id = current_setting('app.shop_id', true)::uuid)`,
    }),
    pgPolicy("order_items_public_insert", {
      for: "insert",
      withCheck: sql`${table.orderId} in (select o.id from orders o inner join shops s on s.id = o.shop_id where s.status = 'active')`,
    }),
  ],
).enableRLS();
