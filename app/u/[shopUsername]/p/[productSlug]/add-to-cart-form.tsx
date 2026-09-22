"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MinusIcon, PlusIcon, ShoppingCartIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/storefront/cart-provider";

export function AddToCartForm({
  product,
  shopUsername,
}: {
  product: { productId: string; name: string; pricePaise: number; imageUrl: string | null };
  shopUsername: string;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  function handleAddToCart() {
    addItem(product, quantity);
    router.push(`/u/${shopUsername}/cart`);
  }

  return (
    <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t bg-background/95 p-4 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
      <div className="flex items-center gap-1 rounded-full border">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex size-11 items-center justify-center text-muted-foreground active:text-foreground sm:size-9"
        >
          <MinusIcon className="size-4" />
        </button>
        <span className="w-6 text-center text-sm font-medium tabular-nums">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="flex size-11 items-center justify-center text-muted-foreground active:text-foreground sm:size-9"
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
      <Button onClick={handleAddToCart} className="h-11 flex-1 rounded-full sm:h-10">
        <ShoppingCartIcon className="size-4" />
        Add to cart
      </Button>
    </div>
  );
}
