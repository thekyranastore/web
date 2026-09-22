import Link from "next/link";
import Image from "next/image";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { shops, products } from "@/db/schema";
import { formatPaise } from "@/lib/currency";
import { StorefrontHero } from "@/components/storefront/storefront-hero";
import { PackageIcon } from "@phosphor-icons/react/dist/ssr";

export const revalidate = 60;

export default async function StorefrontHomePage({
  params,
}: {
  params: Promise<{ shopUsername: string }>;
}) {
  const { shopUsername } = await params;

  const [shop] = await db
    .select({ id: shops.id, bannerUrls: shops.bannerUrls, bannerVideoUrl: shops.bannerVideoUrl })
    .from(shops)
    .where(and(eq(shops.username, shopUsername), eq(shops.status, "active")))
    .limit(1);

  if (!shop) {
    return null;
  }

  const shopProducts = await db
    .select()
    .from(products)
    .where(and(eq(products.shopId, shop.id), eq(products.status, "active")));

  return (
    <>
      <StorefrontHero bannerUrls={shop.bannerUrls} bannerVideoUrl={shop.bannerVideoUrl} />

      {shopProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 p-8 text-center text-muted-foreground sm:p-16">
          <PackageIcon className="size-8" />
          <p>This store hasn&apos;t added any products yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4">
          {shopProducts.map((product) => (
            <Link key={product.id} href={`/u/${shopUsername}/p/${product.slug}`} className="group flex flex-col gap-2">
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted">
                {product.imageUrls[0] ? (
                  <Image
                    src={product.imageUrls[0]}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <PackageIcon className="size-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="text-sm font-semibold tabular-nums">{formatPaise(product.pricePaise)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
