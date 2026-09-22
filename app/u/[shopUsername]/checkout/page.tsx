"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/components/storefront/cart-provider";
import { placeOrder } from "@/actions/checkout";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/order";
import { formatPaise } from "@/lib/currency";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ shopUsername: string }>;
}) {
  const { shopUsername } = use(params);
  const router = useRouter();
  const { items, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
  });

  const total = items.reduce((sum, item) => sum + item.pricePaise * item.quantity, 0);

  async function onSubmit(values: CheckoutInput) {
    setSubmitting(true);
    setFormError(null);

    const result = await placeOrder({
      shopUsername,
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      customer: values,
    });

    setSubmitting(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    clear();
    router.push(`/u/${shopUsername}/checkout/confirmed`);
  }

  if (items.length === 0) {
    return <p className="p-16 text-center text-muted-foreground">Your cart is empty.</p>;
  }

  return (
    <div className="grid gap-6 p-4 pb-24 sm:grid-cols-3 sm:p-6 sm:pb-6">
      <div className="sm:col-span-2">
        <h1 className="mb-1 text-2xl font-bold">Checkout</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Pay on delivery — the store will contact you to confirm your order.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Full name</Label>
            <Input id="customerName" {...register("customerName")} />
            {errors.customerName && (
              <p className="text-sm text-destructive">{errors.customerName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone number</Label>
            <Input id="customerPhone" {...register("customerPhone")} />
            {errors.customerPhone && (
              <p className="text-sm text-destructive">{errors.customerPhone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="line1">Address</Label>
            <Input id="line1" placeholder="House / street" {...register("address.line1")} />
            {errors.address?.line1 && (
              <p className="text-sm text-destructive">{errors.address.line1.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="line2">Landmark (optional)</Label>
            <Input id="line2" {...register("address.line2")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("address.city")} />
              {errors.address?.city && (
                <p className="text-sm text-destructive">{errors.address.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("address.state")} />
              {errors.address?.state && (
                <p className="text-sm text-destructive">{errors.address.state.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" {...register("address.pincode")} />
            {errors.address?.pincode && (
              <p className="text-sm text-destructive">{errors.address.pincode.message}</p>
            )}
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
            <Button type="submit" disabled={submitting} className="h-11 w-full rounded-full">
              {submitting ? "Placing order..." : `Place order · ${formatPaise(total)}`}
            </Button>
          </div>

          <Button type="submit" disabled={submitting} className="hidden rounded-full sm:block">
            {submitting ? "Placing order..." : "Place order"}
          </Button>
        </form>
      </div>

      <div className="hidden sm:block">
        <Card>
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between text-sm">
                <span className="truncate">
                  {item.name} × {item.quantity}
                </span>
                <span className="tabular-nums">{formatPaise(item.pricePaise * item.quantity)}</span>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-between border-t pt-2 font-bold">
              <span>Total</span>
              <span className="tabular-nums">{formatPaise(total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
