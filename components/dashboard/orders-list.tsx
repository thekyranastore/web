import { ShoppingCartIcon, MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/shared/status-badge";
import { OrderDetailDialog } from "@/components/dashboard/order-detail-dialog";
import { formatPaise } from "@/lib/currency";
import type { OrderAddress } from "@/db/schema";
import type { orderStatusEnum } from "@/lib/validations/order";

type OrderStatus = (typeof orderStatusEnum)[number];

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: OrderAddress;
  status: OrderStatus;
  paymentStatus: string;
  totalPaise: number;
  createdAt: Date;
};

type OrderItem = {
  productName: string;
  quantity: number;
  pricePaise: number;
};

export function OrdersList({
  orders,
  itemsByOrder,
  hasAnyOrders,
}: {
  orders: Order[];
  itemsByOrder: Record<string, OrderItem[]>;
  hasAnyOrders: boolean;
}) {
  if (!hasAnyOrders) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
          <ShoppingCartIcon className="size-8" />
          <p>No orders yet.</p>
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
          <MagnifyingGlassIcon className="size-8" />
          <p>No orders match this filter.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 sm:hidden">
        {orders.map((order) => {
          const items = itemsByOrder[order.id] ?? [];
          const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <OrderDetailDialog key={order.id} order={order} items={items}>
              <Card className="cursor-pointer">
                <CardContent className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium">{order.customerName}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {itemCount} item{itemCount === 1 ? "" : "s"} ·{" "}
                      {order.createdAt.toLocaleDateString()}
                    </span>
                    <span className="tabular-nums font-medium text-foreground">
                      {formatPaise(order.totalPaise)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </OrderDetailDialog>
          );
        })}
      </div>

      <Table className="hidden sm:table">
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const items = itemsByOrder[order.id] ?? [];
            const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <OrderDetailDialog key={order.id} order={order} items={items}>
                <TableRow className="cursor-pointer">
                  <TableCell className="font-medium">{order.customerName}</TableCell>
                  <TableCell>
                    {itemCount} item{itemCount === 1 ? "" : "s"}
                  </TableCell>
                  <TableCell className="tabular-nums">{formatPaise(order.totalPaise)}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.createdAt.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              </OrderDetailDialog>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
