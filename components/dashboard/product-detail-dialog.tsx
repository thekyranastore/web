"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PackageIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/dashboard/product-form";
import { ArchiveProductButton } from "@/app/(dashboard)/dashboard/products/archive-product-button";
import { formatPaise } from "@/lib/currency";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
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

function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const embedUrl = product.videoUrl ? getYoutubeEmbedUrl(product.videoUrl) : null;
  const media = [...product.imageUrls.map((url) => ({ type: "image" as const, url }))];

  if (media.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
        <PackageIcon className="size-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={media[activeIndex].url}
          alt=""
          width={400}
          height={400}
          className="size-full object-cover"
        />
      </div>
      {(media.length > 1 || embedUrl) && (
        <div className="flex gap-2">
          {media.map((item, index) => (
            <button
              key={item.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`size-12 shrink-0 overflow-hidden rounded-md ring-2 ${
                index === activeIndex ? "ring-primary" : "ring-transparent"
              }`}
            >
              <Image src={item.url} alt="" width={48} height={48} className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {embedUrl && (
        <div className="aspect-video overflow-hidden rounded-lg">
          <iframe
            src={embedUrl}
            title="Product video"
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

export type ProductDetailDialogHandle = {
  openEdit: () => void;
};

export const ProductDetailDialog = forwardRef<ProductDetailDialogHandle, {
  product: Product;
  analytics: ProductAnalytics;
}>(function ProductDetailDialog({ product, analytics }, ref) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    openEdit: () => {
      setMode("edit");
      setOpen(true);
    },
  }));

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setMode("view");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-w-0 flex-1 items-center gap-4 text-left"
      >
        {product.imageUrls[0] ? (
          <Image
            src={product.imageUrls[0]}
            alt=""
            width={56}
            height={56}
            className="size-14 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted">
            <PackageIcon className="size-5 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium hover:underline">{product.name}</p>
          <p className="text-sm text-muted-foreground tabular-nums">
            {formatPaise(product.pricePaise)} · Stock {product.stockQty}
          </p>
        </div>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          {mode === "view" ? (
            <>
              <DialogHeader>
                <DialogTitle>{product.name}</DialogTitle>
                <DialogDescription>Product details and performance</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <ProductGallery product={product} />

                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-lg font-bold tabular-nums">
                        {formatPaise(product.pricePaise)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stock</p>
                      <p className="text-lg font-bold tabular-nums">{product.stockQty} units</p>
                    </div>
                  </div>

                  {product.description && (
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm">{product.description}</p>
                    </div>
                  )}

                  <div className="rounded-lg border p-4">
                    <p className="mb-3 text-sm font-medium">Analytics</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Units sold</p>
                        <p className="text-lg font-extrabold tabular-nums">{analytics.unitsSold}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="text-lg font-extrabold tabular-nums">
                          {formatPaise(analytics.revenuePaise)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Orders</p>
                        <p className="text-lg font-extrabold tabular-nums">{analytics.orderCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setMode("edit")}
                    >
                      <PencilSimpleIcon className="size-4" />
                      Edit
                    </Button>
                    {product.status !== "archived" && (
                      <ArchiveProductButton productId={product.id} />
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Edit product</DialogTitle>
                <DialogDescription>Update your product details.</DialogDescription>
              </DialogHeader>
              <ProductForm
                productId={product.id}
                defaultValues={{
                  name: product.name,
                  description: product.description ?? undefined,
                  pricePaise: product.pricePaise,
                  stockQty: product.stockQty,
                  imageUrls: product.imageUrls,
                  videoUrl: product.videoUrl ?? undefined,
                }}
                onSuccess={() => {
                  setOpen(false);
                  setMode("view");
                  router.refresh();
                }}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
});
