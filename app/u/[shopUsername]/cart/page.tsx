"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/storefront/cart-provider";
import { formatPaise } from "@/lib/currency";
import { MinusIcon, PackageIcon, PlusIcon, ShoppingCartIcon, TrashIcon } from "@phosphor-icons/react";

export default function CartPage({
  params,
}: {
  params: Promise<{ shopUsername: string }>;
}) {
  const { shopUsername } = use(params);
  const { items, updateQuantity, removeItem } = useCart();
  const total = items.reduce((sum, item) => sum + item.pricePaise * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 p-16 text-center">
        <ShoppingCartIcon className="size-10 text-muted-foreground" />
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="rounded-full">
          <Link href={`/u/${shopUsername}`}>Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Your cart</h1>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3 rounded-xl border p-3">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt=""
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted">
                <PackageIcon className="size-5 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground tabular-nums">
                {formatPaise(item.pricePaise)}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border px-2 py-1">
              <button
                type="button"
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="flex size-5 items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <MinusIcon className="size-3.5" />
              </button>
              <span className="w-5 text-center text-sm font-medium tabular-nums">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="flex size-5 items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <PlusIcon className="size-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t pt-4 text-lg font-bold">
        <span>Total</span>
        <span className="tabular-nums">{formatPaise(total)}</span>
      </div>
      <Button asChild className="rounded-full">
        <Link href={`/u/${shopUsername}/checkout`}>Checkout</Link>
      </Button>
    </div>
  );
}
