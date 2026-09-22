"use client";

import Link from "next/link";
import { BellIcon as Bell } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatPaise } from "@/lib/currency";

type PendingOrder = {
  id: string;
  customerName: string;
  totalPaise: number;
};

export function NotificationsMenu({ pendingOrders }: { pendingOrders: PendingOrder[] }) {
  const count = pendingOrders.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative size-11 sm:size-8">
          <Bell className="size-4" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold">Pending orders</p>
        </div>
        {count === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            No pending orders right now.
          </p>
        ) : (
          <div className="flex flex-col p-1">
            {pendingOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <span className="truncate font-medium">{order.customerName}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {formatPaise(order.totalPaise)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
