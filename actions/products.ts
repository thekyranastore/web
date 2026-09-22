"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { products, shops } from "@/db/schema";
import { getCurrentShop } from "@/lib/current-shop";
import { withShopScope } from "@/lib/tenant-db";
import { productSchema, firstProductSchema } from "@/lib/validations/product";
import { slugify } from "@/lib/slug";

export async function createFirstProduct(input: unknown) {
  const shop = await getCurrentShop();

  if (!shop) {
    return { error: "Shop not found" };
  }

  const parsed = firstProductSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await withShopScope(shop.id, async (tx) => {
    await tx.insert(products).values({
      shopId: shop.id,
      name: parsed.data.name,
      slug: slugify(parsed.data.name),
      pricePaise: parsed.data.pricePaise,
      stockQty: parsed.data.stockQty,
      imageUrls: parsed.data.imageUrl ? [parsed.data.imageUrl] : [],
      status: "active",
    });

    await tx.update(shops).set({ onboardingStep: "completed" }).where(eq(shops.id, shop.id));
  });

  revalidatePath("/dashboard");
  return { error: null };
}

export async function createProduct(input: unknown) {
  const shop = await getCurrentShop();

  if (!shop) {
    return { error: "Shop not found" };
  }

  const parsed = productSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await withShopScope(shop.id, (tx) =>
    tx.insert(products).values({
      shopId: shop.id,
      name: parsed.data.name,
      slug: slugify(parsed.data.name),
      description: parsed.data.description || null,
      pricePaise: parsed.data.pricePaise,
      stockQty: parsed.data.stockQty,
      imageUrls: parsed.data.imageUrls,
      videoUrl: parsed.data.videoUrl || null,
      status: "active",
    }),
  );

  revalidatePath("/dashboard/products");
  return { error: null };
}

export async function updateProduct(productId: string, input: unknown) {
  const shop = await getCurrentShop();

  if (!shop) {
    return { error: "Shop not found" };
  }

  const parsed = productSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await withShopScope(shop.id, (tx) =>
    tx
      .update(products)
      .set({
        name: parsed.data.name,
        slug: slugify(parsed.data.name),
        description: parsed.data.description || null,
        pricePaise: parsed.data.pricePaise,
        stockQty: parsed.data.stockQty,
        imageUrls: parsed.data.imageUrls,
        videoUrl: parsed.data.videoUrl || null,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, productId), eq(products.shopId, shop.id))),
  );

  revalidatePath("/dashboard/products");
  return { error: null };
}

export async function archiveProduct(productId: string) {
  const shop = await getCurrentShop();

  if (!shop) {
    return { error: "Shop not found" };
  }

  await withShopScope(shop.id, (tx) =>
    tx
      .update(products)
      .set({ status: "archived", updatedAt: new Date() })
      .where(and(eq(products.id, productId), eq(products.shopId, shop.id))),
  );

  revalidatePath("/dashboard/products");
  return { error: null };
}
