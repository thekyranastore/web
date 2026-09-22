import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { shops, products } from "@/db/schema";
import { formatPaise } from "@/lib/currency";
import { AddToCartForm } from "./add-to-cart-form";
import { ProductGallery } from "./product-gallery";

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ shopUsername: string; productSlug: string }>;
}) {
  const { shopUsername, productSlug } = await params;

  const [shop] = await db
    .select({ id: shops.id })
    .from(shops)
    .where(and(eq(shops.username, shopUsername), eq(shops.status, "active")))
    .limit(1);

  if (!shop) {
    notFound();
  }

  const [product] = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.shopId, shop.id),
        eq(products.slug, productSlug),
        eq(products.status, "active"),
      ),
    )
    .limit(1);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-8 p-4 sm:grid-cols-2 sm:p-6">
      <ProductGallery imageUrls={product.imageUrls} videoUrl={product.videoUrl} name={product.name} />

      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="mt-1 text-xl font-bold tabular-nums text-primary">
            {formatPaise(product.pricePaise)}
          </p>
        </div>
        {product.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        )}
        <AddToCartForm
          product={{
            productId: product.id,
            name: product.name,
            pricePaise: product.pricePaise,
            imageUrl: product.imageUrls[0] ?? null,
          }}
          shopUsername={shopUsername}
        />
      </div>
    </div>
  );
}
