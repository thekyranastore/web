import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyField } from "@/components/shared/copy-field";
import { OrderStatusBadge } from "@/components/shared/status-badge";
import { RevenueSparkline } from "@/components/dashboard/revenue-sparkline";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { NotificationsMenu } from "@/components/dashboard/notifications-menu";
import { getCurrentShop } from "@/lib/current-shop";
import { getStoreUrl } from "@/lib/store-url";
import { withShopScope } from "@/lib/tenant-db";
import { getShopAnalytics, getPendingOrdersForShop } from "@/lib/analytics";
import { formatPaise } from "@/lib/currency";
import { redirect } from "next/navigation";

export default async function DashboardHomePage() {
  const shop = await getCurrentShop();

  if (!shop) {
    redirect("/onboarding/shop");
  }

  const { revenuePaise, orderCount, recentOrders, revenueTrend, pendingOrders } = await withShopScope(
    shop.id,
    async (tx) => ({
      ...(await getShopAnalytics(tx, shop.id)),
      pendingOrders: await getPendingOrdersForShop(tx, shop.id),
    }),
  );
  const storeUrl = getStoreUrl(shop.username);
  const avgOrderPaise = orderCount > 0 ? Math.round(revenuePaise / orderCount) : 0;

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Overview"
        action={<NotificationsMenu pendingOrders={pendingOrders} />}
      />

      <div className="flex flex-col gap-6 p-4 sm:p-6">
        {orderCount === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Share your store to get your first order</CardTitle>
            </CardHeader>
            <CardContent>
              <CopyField value={storeUrl} />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-3xl font-extrabold tabular-nums">{formatPaise(revenuePaise)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-3xl font-extrabold tabular-nums">{orderCount}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col gap-1">
                  <p className="text-sm text-muted-foreground">Avg. order value</p>
                  <p className="text-3xl font-extrabold tabular-nums">{formatPaise(avgOrderPaise)}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue trend</CardTitle>
                <p className="text-sm text-muted-foreground">Daily revenue across all orders</p>
              </CardHeader>
              <CardContent>
                <RevenueSparkline points={revenueTrend} />
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {recentOrders.length === 0 && (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            )}
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-muted"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground tabular-nums">
                    {formatPaise(order.totalPaise)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
