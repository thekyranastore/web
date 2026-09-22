"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePicker } from "@/components/shared/image-picker";
import { createFirstProduct } from "@/actions/products";
import { firstProductSchema, type FirstProductInput } from "@/lib/validations/product";

export function FirstProductForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FirstProductInput>({
    resolver: zodResolver(firstProductSchema),
    defaultValues: { stockQty: 1 },
  });

  async function onSubmit(values: FirstProductInput) {
    setSubmitting(true);
    setFormError(null);

    const result = await createFirstProduct({ ...values, imageUrl });

    setSubmitting(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Photo</Label>
        <ImagePicker folder="products" value={imageUrl} onChange={setImageUrl} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Product name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
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
          <Label htmlFor="stockQty">Quantity</Label>
          <Input id="stockQty" type="number" {...register("stockQty", { valueAsNumber: true })} />
        </div>
      </div>
      {formError && <p className="text-sm text-destructive">{formError}</p>}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Saving..." : "Go to dashboard"}
      </Button>
    </form>
  );
}
