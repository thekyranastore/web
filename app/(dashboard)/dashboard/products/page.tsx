import Link from "next/link";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { products } from "@/db/schema";
import { getCurrentShop } from "@/lib/current-shop";
import { withShopScope } from "@/lib/tenant-db";
import { getProductAnalyticsForShop, type ProductAnalytics } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProductsFilterBar } from "@/components/dashboard/products-filter-bar";
import { ProductsList } from "@/components/dashboard/products-list";
import { Pagination } from "@/components/shared/pagination";
import { PlusCircleIcon as PlusCircle } from "@phosphor-icons/react/dist/ssr";

const PAGE_SIZE = 20;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const shop = await getCurrentShop();

  if (!shop) {
    return null;
  }

  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const page = Math.max(1, Number(pageParam) || 1);

  const { hasAnyProduct, totalCount, shopProducts, analytics } = await withShopScope(shop.id, async (tx) => {
    const where = and(eq(products.shopId, shop.id), query ? ilike(products.name, `%${query}%`) : undefined);

    const [hasAny] = await tx.select({ id: products.id }).from(products).where(eq(products.shopId, shop.id)).limit(1);

    const [{ count }] = await tx.select({ count: sql<number>`count(*)` }).from(products).where(where);

    const rows = await tx
      .select()
      .from(products)
      .where(where)
      .orderBy(desc(products.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE);

    const analyticsMap = await getProductAnalyticsForShop(
      tx,
      shop.id,
      rows.map((product) => product.id),
    );

    return {
      hasAnyProduct: Boolean(hasAny),
      totalCount: Number(count),
      shopProducts: rows,
      analytics: Object.fromEntries(analyticsMap) as Record<string, ProductAnalytics>,
    };
  });

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Products"
        action={
          <Button asChild className="rounded-full">
            <Link href="/dashboard/products/new">
              <PlusCircle className="size-4" />
              Add product
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-4 p-4 sm:p-6">
        {hasAnyProduct && <ProductsFilterBar defaultQuery={query} />}
        <ProductsList
          products={shopProducts}
          analytics={analytics}
          hasAnyProducts={hasAnyProduct}
          query={query}
        />
        <Pagination page={page} pageSize={PAGE_SIZE} totalCount={totalCount} />
      </div>
    </div>
  );
}
