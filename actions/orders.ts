"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { orders } from "@/db/schema";
import { getCurrentShop } from "@/lib/current-shop";
import { withShopScope } from "@/lib/tenant-db";
import { orderStatusTransitions, updateOrderStatusSchema } from "@/lib/validations/order";

export async function updateOrderStatus(input: unknown) {
  const shop = await getCurrentShop();

  if (!shop) {
    return { error: "Shop not found" };
  }

  const parsed = updateOrderStatusSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await withShopScope(shop.id, async (tx) => {
    const [order] = await tx
      .select({ status: orders.status })
      .from(orders)
      .where(and(eq(orders.id, parsed.data.orderId), eq(orders.shopId, shop.id)))
      .limit(1);

    if (!order) {
      return { error: "Order not found" };
    }

    const allowedNextStatuses = orderStatusTransitions[order.status];

    if (!allowedNextStatuses.includes(parsed.data.status)) {
      return { error: `Cannot move an order from ${order.status} to ${parsed.data.status}` };
    }

    await tx
      .update(orders)
      .set({ status: parsed.data.status })
      .where(and(eq(orders.id, parsed.data.orderId), eq(orders.shopId, shop.id)));

    return { error: null };
  });

  if (!result.error) {
    revalidatePath("/dashboard/orders");
  }

  return result;
}
