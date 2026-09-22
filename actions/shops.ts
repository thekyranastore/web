"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { shops } from "@/db/schema";
import { getCurrentMerchant, getCurrentShop, getCurrentSession } from "@/lib/current-shop";
import { withUserScope } from "@/lib/tenant-db";
import {
  shopDetailsSchema,
  shopCategorySchema,
  shopProfileSchema,
  shopAppearanceSchema,
} from "@/lib/validations/shop";

export async function createShopDetails(input: unknown) {
  const merchant = await getCurrentMerchant();

  if (!merchant) {
    return { error: "You must be logged in" };
  }

  const parsed = shopDetailsSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const result = await withUserScope(merchant.userId, async (tx) => {
    const existing = await tx
      .select({ id: shops.id })
      .from(shops)
      .where(eq(shops.username, parsed.data.username))
      .limit(1);

    if (existing.length > 0) {
      return { error: "That storefront username is already taken" };
    }

    await tx.insert(shops).values({
      merchantId: merchant.id,
      name: parsed.data.name,
      username: parsed.data.username,
      gstin: parsed.data.gstin,
      onboardingStep: "shop_details",
    });

    return { error: null };
  });

  if (!result.error) {
    revalidatePath("/onboarding");
  }

  return result;
}

export async function setShopCategory(input: unknown) {
  const shop = await getCurrentShop();

  if (!shop) {
    return { error: "Shop not found" };
  }

  const parsed = shopCategorySchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await getCurrentSession();

  await withUserScope(session!.user.id, (tx) =>
    tx
      .update(shops)
      .set({ categoryId: parsed.data.categoryId, onboardingStep: "category" })
      .where(eq(shops.id, shop.id)),
  );

  revalidatePath("/onboarding");
  return { error: null };
}

export async function updateShopProfile(input: unknown) {
  const shop = await getCurrentShop();

  if (!shop) {
    return { error: "Shop not found" };
  }

  const parsed = shopProfileSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await getCurrentSession();

  await withUserScope(session!.user.id, (tx) =>
    tx
      .update(shops)
      .set({
        name: parsed.data.name,
        description: parsed.data.description || null,
        logoUrl: parsed.data.logoUrl || null,
      })
      .where(eq(shops.id, shop.id)),
  );

  revalidatePath("/dashboard/settings");
  return { error: null };
}

export async function updateShopAppearance(input: unknown) {
  const shop = await getCurrentShop();

  if (!shop) {
    return { error: "Shop not found" };
  }

  const parsed = shopAppearanceSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await getCurrentSession();

  await withUserScope(session!.user.id, (tx) =>
    tx
      .update(shops)
      .set({
        bannerUrls: parsed.data.bannerUrls,
        bannerVideoUrl: parsed.data.bannerVideoUrl || null,
        accentColor: parsed.data.accentColor || null,
      })
      .where(eq(shops.id, shop.id)),
  );

  revalidatePath("/dashboard/settings");
  revalidatePath(`/u/${shop.username}`);
  return { error: null };
}
