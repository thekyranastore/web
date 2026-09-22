"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SquaresFourIcon as LayoutDashboard,
  PackageIcon as Package,
  ShoppingCartIcon as ShoppingCart,
  PlusCircleIcon as PlusCircle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const navGroups = [
  {
    label: "Shop",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/products", label: "Products", icon: Package },
    ],
  },
  {
    label: "Orders",
    items: [{ href: "/dashboard/orders", label: "Orders", icon: ShoppingCart }],
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6">
      <Button asChild className="w-full rounded-full">
        <Link href="/dashboard/products/new">
          <PlusCircle className="size-4" />
          Add product
        </Link>
      </Button>

      {navGroups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p className="px-3 text-xs font-semibold tracking-wide text-muted-foreground/70 uppercase">
            {group.label}
          </p>
          {group.items.map((item) => {
            const isActive =
              item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex w-full items-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
