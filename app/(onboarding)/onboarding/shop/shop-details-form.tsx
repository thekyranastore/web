"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createShopDetails } from "@/actions/shops";
import { shopDetailsSchema, type ShopDetailsInput } from "@/lib/validations/shop";

export function ShopDetailsForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShopDetailsInput>({
    resolver: zodResolver(shopDetailsSchema),
  });

  async function onSubmit(values: ShopDetailsInput) {
    setSubmitting(true);
    setFormError(null);

    const result = await createShopDetails(values);

    setSubmitting(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    router.push("/onboarding/category");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Shop name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Storefront username</Label>
        <Input id="username" placeholder="my-shop" {...register("username")} />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="gstin">GSTIN</Label>
        <Input id="gstin" placeholder="22AAAAA0000A1Z5" {...register("gstin")} />
        {errors.gstin && <p className="text-sm text-destructive">{errors.gstin.message}</p>}
      </div>
      {formError && <p className="text-sm text-destructive">{formError}</p>}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Saving..." : "Continue"}
      </Button>
    </form>
  );
}
