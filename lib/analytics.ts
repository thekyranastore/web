import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { orders, orderItems, products } from "@/db/schema";
import type { Tx } from "@/lib/tenant-db";

export async function getShopAnalytics(tx: Tx, shopId: string) {
  const [totals] = await tx
    .select({
      revenuePaise: sql<number>`coalesce(sum(${orders.totalPaise}) filter (where ${orders.paymentStatus} = 'paid'), 0)`,
      orderCount: sql<number>`count(*)`,
    })
    .from(orders)
    .where(eq(orders.shopId, shopId));

  const recentOrders = await tx
    .select()
    .from(orders)
    .where(eq(orders.shopId, shopId))
    .orderBy(desc(orders.createdAt))
    .limit(5);

  const dailyRevenue = await tx
    .select({
      day: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM-DD')`,
      revenuePaise: sql<number>`coalesce(sum(${orders.totalPaise}) filter (where ${orders.paymentStatus} = 'paid'), 0)`,
    })
    .from(orders)
    .where(eq(orders.shopId, shopId))
    .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`);

  const revenueTrend = dailyRevenue.map((row) => Number(row.revenuePaise));

  return {
    revenuePaise: Number(totals?.revenuePaise ?? 0),
    orderCount: Number(totals?.orderCount ?? 0),
    recentOrders,
    revenueTrend,
  };
}

export async function getPendingOrdersForShop(tx: Tx, shopId: string) {
  return tx
    .select()
    .from(orders)
    .where(and(eq(orders.shopId, shopId), eq(orders.status, "pending")))
    .orderBy(desc(orders.createdAt))
    .limit(10);
}

export type ProductAnalytics = {
  unitsSold: number;
  revenuePaise: number;
  orderCount: number;
};

export async function getProductAnalyticsForShop(tx: Tx, shopId: string, productIds?: string[]) {
  if (productIds && productIds.length === 0) {
    return new Map<string, ProductAnalytics>();
  }

  const rows = await tx
    .select({
      productId: orderItems.productId,
      unitsSold: sql<number>`coalesce(sum(${orderItems.quantity}) filter (where ${orders.status} != 'cancelled'), 0)`,
      revenuePaise: sql<number>`coalesce(sum(${orderItems.quantity} * ${orderItems.pricePaise}) filter (where ${orders.paymentStatus} = 'paid'), 0)`,
      orderCount: sql<number>`count(distinct ${orderItems.orderId}) filter (where ${orders.status} != 'cancelled')`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(
      and(
        eq(products.shopId, shopId),
        productIds ? inArray(orderItems.productId, productIds) : undefined,
      ),
    )
    .groupBy(orderItems.productId);

  const map = new Map<string, ProductAnalytics>();

  for (const row of rows) {
    map.set(row.productId, {
      unitsSold: Number(row.unitsSold),
      revenuePaise: Number(row.revenuePaise),
      orderCount: Number(row.orderCount),
    });
  }

  return map;
}
