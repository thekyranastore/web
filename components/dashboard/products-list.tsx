"use client";

import { useRef } from "react";
import { MagnifyingGlassIcon, PackageIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductStatusBadge } from "@/components/shared/status-badge";
import {
  ProductDetailDialog,
  type ProductDetailDialogHandle,
} from "@/components/dashboard/product-detail-dialog";
import { ArchiveProductButton } from "@/app/(dashboard)/dashboard/products/archive-product-button";
import type { ProductAnalytics } from "@/lib/analytics";

type Product = {
  id: string;
  name: string;
  description: string | null;
  pricePaise: number;
  stockQty: number;
  imageUrls: string[];
  videoUrl: string | null;
  status: string;
};

function ProductRow({
  product,
  analytics,
}: {
  product: Product;
  analytics: ProductAnalytics;
}) {
  const dialogRef = useRef<ProductDetailDialogHandle>(null);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
        <ProductDetailDialog ref={dialogRef} product={product} analytics={analytics} />
        <div className="flex items-center justify-between gap-2 sm:shrink-0 sm:justify-end">
          <ProductStatusBadge status={product.status} />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => dialogRef.current?.openEdit()}
            >
              <PencilSimpleIcon className="size-4" />
              Edit
            </Button>
            {product.status !== "archived" && <ArchiveProductButton productId={product.id} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductsList({
  products,
  analytics,
  hasAnyProducts,
  query,
}: {
  products: Product[];
  analytics: Record<string, ProductAnalytics>;
  hasAnyProducts: boolean;
  query: string;
}) {
  if (!hasAnyProducts) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
          <PackageIcon className="size-8" />
          <p>No products yet. Add your first one to go live.</p>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
          <MagnifyingGlassIcon className="size-8" />
          <p>No products match &ldquo;{query}&rdquo;.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {products.map((product) => (
        <ProductRow
          key={product.id}
          product={product}
          analytics={analytics[product.id] ?? { unitsSold: 0, revenuePaise: 0, orderCount: 0 }}
        />
      ))}
    </div>
  );
}
