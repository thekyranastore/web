import { and, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { orders, orderItems, products } from "@/db/schema";
import { getCurrentShop } from "@/lib/current-shop";
import { withShopScope } from "@/lib/tenant-db";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { OrdersFilterBar } from "@/components/dashboard/orders-filter-bar";
import { OrdersList } from "@/components/dashboard/orders-list";
import { Pagination } from "@/components/shared/pagination";
import { orderStatusEnum } from "@/lib/validations/order";

const PAGE_SIZE = 20;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const shop = await getCurrentShop();

  if (!shop) {
    return null;
  }

  const { q, status, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const statusFilter = orderStatusEnum.includes(status as (typeof orderStatusEnum)[number])
    ? (status as (typeof orderStatusEnum)[number])
    : undefined;
  const page = Math.max(1, Number(pageParam) || 1);

  const { hasAnyOrder, totalCount, shopOrders, itemsByOrder } = await withShopScope(shop.id, async (tx) => {
    const where = and(
      eq(orders.shopId, shop.id),
      statusFilter ? eq(orders.status, statusFilter) : undefined,
      query ? ilike(orders.customerName, `%${query}%`) : undefined,
    );

    const [hasAny] = await tx.select({ id: orders.id }).from(orders).where(eq(orders.shopId, shop.id)).limit(1);

    const [{ count }] = await tx.select({ count: sql<number>`count(*)` }).from(orders).where(where);

    const rows = await tx
      .select()
      .from(orders)
      .where(where)
      .orderBy(desc(orders.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE);

    const orderIds = rows.map((order) => order.id);

    const itemRows = orderIds.length
      ? await tx
          .select({
            orderId: orderItems.orderId,
            quantity: orderItems.quantity,
            pricePaise: orderItems.pricePaise,
            productName: products.name,
          })
          .from(orderItems)
          .innerJoin(products, eq(orderItems.productId, products.id))
          .where(inArray(orderItems.orderId, orderIds))
      : [];

    const grouped: Record<string, { productName: string; quantity: number; pricePaise: number }[]> = {};

    for (const row of itemRows) {
      if (!grouped[row.orderId]) {
        grouped[row.orderId] = [];
      }
      grouped[row.orderId].push({
        productName: row.productName,
        quantity: row.quantity,
        pricePaise: row.pricePaise,
      });
    }

    return {
      hasAnyOrder: Boolean(hasAny),
      totalCount: Number(count),
      shopOrders: rows,
      itemsByOrder: grouped,
    };
  });

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Orders" />

      <div className="flex flex-col gap-4 p-4 sm:p-6">
        {hasAnyOrder && <OrdersFilterBar defaultQuery={query} defaultStatus={statusFilter ?? "all"} />}
        <OrdersList orders={shopOrders} itemsByOrder={itemsByOrder} hasAnyOrders={hasAnyOrder} />
        <Pagination page={page} pageSize={PAGE_SIZE} totalCount={totalCount} />
      </div>
    </div>
  );
}
