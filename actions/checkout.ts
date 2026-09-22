"use server";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { shops, products, orders, orderItems } from "@/db/schema";
import { checkoutSchema } from "@/lib/validations/order";
import { z } from "zod";

const placeOrderSchema = z.object({
  shopUsername: z.string(),
  items: z
    .array(
      z.object({
        productId: z.uuid(),
        quantity: z.coerce.number().int().min(1),
      }),
    )
    .min(1, "Your cart is empty"),
  customer: checkoutSchema,
});

export async function placeOrder(input: unknown) {
  const parsed = placeOrderSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const [shop] = await db
    .select({ id: shops.id })
    .from(shops)
    .where(and(eq(shops.username, parsed.data.shopUsername), eq(shops.status, "active")))
    .limit(1);

  if (!shop) {
    return { error: "Store not found" };
  }

  const productIds = parsed.data.items.map((item) => item.productId);

  const shopProducts = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.shopId, shop.id),
        eq(products.status, "active"),
        inArray(products.id, productIds),
      ),
    );

  if (shopProducts.length !== productIds.length) {
    return { error: "One or more items are no longer available" };
  }

  const priceByProductId = new Map(shopProducts.map((product) => [product.id, product.pricePaise]));

  const totalPaise = parsed.data.items.reduce((sum, item) => {
    return sum + (priceByProductId.get(item.productId) ?? 0) * item.quantity;
  }, 0);

  const [order] = await db
    .insert(orders)
    .values({
      shopId: shop.id,
      customerName: parsed.data.customer.customerName,
      customerPhone: parsed.data.customer.customerPhone,
      customerAddress: parsed.data.customer.address,
      totalPaise,
    })
    .returning({ id: orders.id });

  await db.insert(orderItems).values(
    parsed.data.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      pricePaise: priceByProductId.get(item.productId) ?? 0,
    })),
  );

  return { error: null, orderId: order.id };
}
