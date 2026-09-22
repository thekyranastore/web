import { cache } from "react";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { merchants, shops } from "@/db/schema";
import { withUserScope } from "@/lib/tenant-db";

export const getCurrentSession = cache(async () => {
  const { data } = await auth.getSession();
  return data;
});

export const getCurrentMerchant = cache(async function getCurrentMerchant() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return withUserScope(session.user.id, async (tx) => {
    const [existing] = await tx.select({ id: merchants.id, userId: merchants.userId, createdAt: merchants.createdAt }).from(merchants).where(eq(merchants.userId, session.user.id)).limit(1);

    if (existing) {
      return existing;
    }

    const [created] = await tx
      .insert(merchants)
      .values({ userId: session.user.id })
      .onConflictDoNothing()
      .returning();

    if (created) {
      return created;
    }

    const [merchant] = await tx.select().from(merchants).where(eq(merchants.userId, session.user.id)).limit(1);

    return merchant ?? null;
  });
});

export const getCurrentShop = cache(async function getCurrentShop() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return withUserScope(session.user.id, async (tx) => {
    const [existing] = await tx.select({ id: merchants.id, userId: merchants.userId, createdAt: merchants.createdAt }).from(merchants).where(eq(merchants.userId, session.user.id)).limit(1);

    const merchant =
      existing ??
      (
        await tx.insert(merchants).values({ userId: session.user.id }).onConflictDoNothing().returning()
      )[0] ??
      (await tx.select().from(merchants).where(eq(merchants.userId, session.user.id)).limit(1))[0];

    if (!merchant) {
      return null;
    }

    const [shop] = await tx.select().from(shops).where(eq(shops.merchantId, merchant.id)).limit(1);

    return shop ?? null;
  });
});
