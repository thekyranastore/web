"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCartIcon as ShoppingCart } from "@phosphor-icons/react";
import { useCart } from "@/components/storefront/cart-provider";

export function CartLink() {
  const pathname = usePathname();
  const { items } = useCart();
  const shopUsername = pathname.split("/")[2];
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href={`/u/${shopUsername}/cart`}
      className="relative flex size-9 items-center justify-center rounded-full hover:bg-muted"
    >
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
