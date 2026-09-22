"use client";

import { cloneElement, isValidElement, useState, type ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WhatsappIcon } from "@/components/shared/whatsapp-icon";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { OrderStatusControl } from "@/app/(dashboard)/dashboard/orders/order-status-control";
import { formatPaise } from "@/lib/currency";
import type { OrderAddress } from "@/db/schema";
import type { orderStatusEnum } from "@/lib/validations/order";

type OrderStatus = (typeof orderStatusEnum)[number];

type OrderItem = {
  productName: string;
  quantity: number;
  pricePaise: number;
};

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

export function OrderDetailDialog({
  order,
  items,
  children,
}: {
  order: Order;
  items: OrderItem[];
  children: ReactElement<{ onClick?: () => void }>;
}) {
  const [open, setOpen] = useState(false);

  const trigger = isValidElement(children)
    ? cloneElement(children, { onClick: () => setOpen(true) })
    : children;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Order from {order.customerName}</DialogTitle>
          <DialogDescription>Placed on {order.createdAt.toLocaleDateString()}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <PaymentStatusBadge status={order.paymentStatus} />
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="rounded-lg border p-4">
          <p className="mb-3 text-sm font-medium">Items</p>
          <div className="flex flex-col gap-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span className="tabular-nums">{formatPaise(item.pricePaise * item.quantity)}</span>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-between border-t pt-2 font-bold">
              <span>Total</span>
              <span className="tabular-nums">{formatPaise(order.totalPaise)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <p className="mb-2 text-sm font-medium">Customer</p>
          <div className="text-sm text-muted-foreground">
            <p>{order.customerName}</p>
            <p className="flex items-center gap-2">
              {order.customerPhone}
              <a
                href={`https://wa.me/91${order.customerPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-5 items-center justify-center rounded-full text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950"
                aria-label="Message on WhatsApp"
              >
                <WhatsappIcon className="size-4" />
              </a>
            </p>
            <p>
              {order.customerAddress.line1}
              {order.customerAddress.line2 ? `, ${order.customerAddress.line2}` : ""},{" "}
              {order.customerAddress.city}, {order.customerAddress.state} -{" "}
              {order.customerAddress.pincode}
            </p>
          </div>
        </div>

        <OrderStatusControl orderId={order.id} currentStatus={order.status} />
      </DialogContent>
    </Dialog>
  );
}
