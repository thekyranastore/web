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
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-3 rounded-full border px-3 py-1.5">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex size-6 items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <MinusIcon className="size-4" />
        </button>
        <span className="w-6 text-center text-sm font-medium tabular-nums">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="flex size-6 items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
      <Button onClick={handleAddToCart} className="flex-1 rounded-full">
        <ShoppingCartIcon className="size-4" />
        Add to cart
      </Button>
    </div>
  );
}
