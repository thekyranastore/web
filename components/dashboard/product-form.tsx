"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiImagePicker } from "@/components/shared/multi-image-picker";
import { createProduct, updateProduct } from "@/actions/products";
import { productSchema, type ProductInput } from "@/lib/validations/product";

export function ProductForm({
  productId,
  defaultValues,
  onSuccess,
}: {
  productId?: string;
  defaultValues?: Partial<ProductInput>;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState(defaultValues?.imageUrls ?? []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: { stockQty: 0, imageUrls: [], ...defaultValues },
  });

  async function onSubmit(values: ProductInput) {
    setSubmitting(true);

    const payload = { ...values, imageUrls };
    const result = productId
      ? await updateProduct(productId, payload)
      : await createProduct(payload);

    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(productId ? "Product updated" : "Product added");

    if (onSuccess) {
      onSuccess();
      return;
    }

    router.push("/dashboard/products");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Photos (up to 4)</Label>
        <MultiImagePicker folder="products" value={imageUrls} onChange={setImageUrls} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="pricePaise">Price (paise)</Label>
          <Input id="pricePaise" type="number" {...register("pricePaise", { valueAsNumber: true })} />
          {errors.pricePaise && (
            <p className="text-sm text-destructive">{errors.pricePaise.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockQty">Stock</Label>
          <Input id="stockQty" type="number" {...register("stockQty", { valueAsNumber: true })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="videoUrl">YouTube video (optional)</Label>
        <Input
          id="videoUrl"
          placeholder="https://youtube.com/watch?v=..."
          {...register("videoUrl")}
        />
        {errors.videoUrl && <p className="text-sm text-destructive">{errors.videoUrl.message}</p>}
      </div>
      <Button type="submit" disabled={submitting} className="rounded-full">
        {submitting ? "Saving..." : productId ? "Save changes" : "Add product"}
      </Button>
    </form>
  );
}
