"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GearIcon as Settings, LifebuoyIcon as LifeBuoy } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { LogoutButton } from "@/components/logout-button";
import { Logo } from "@/components/shared/logo";

const utilityItems = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/help", label: "Help & Support", icon: LifeBuoy },
];

export function SidebarContent({ shopName }: { shopName: string }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div className="flex flex-col gap-8">
        <Logo className="h-5 w-auto self-start px-3" />
        <SidebarNav />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 border-t pt-4">
          {utilityItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

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
        <div className="flex flex-col gap-1 rounded-xl border bg-sidebar-accent/40 p-2">
          <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {shopName.charAt(0).toUpperCase()}
            </div>
            <span className="truncate text-sm font-medium text-foreground">{shopName}</span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
