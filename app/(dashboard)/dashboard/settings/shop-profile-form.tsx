"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePicker } from "@/components/shared/image-picker";
import { updateShopProfile } from "@/actions/shops";
import { shopProfileSchema, type ShopProfileInput } from "@/lib/validations/shop";

export function ShopProfileForm({ defaultValues }: { defaultValues: Partial<ShopProfileInput> }) {
  const [submitting, setSubmitting] = useState(false);
  const [logoUrl, setLogoUrl] = useState(defaultValues.logoUrl ?? "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShopProfileInput>({
    resolver: zodResolver(shopProfileSchema),
    defaultValues,
  });

  async function onSubmit(values: ShopProfileInput) {
    setSubmitting(true);
    const result = await updateShopProfile({ ...values, logoUrl });
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Shop profile updated");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Logo</Label>
        <ImagePicker folder="shops" value={logoUrl} onChange={setLogoUrl} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Shop name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>
      <Button type="submit" disabled={submitting} className="rounded-full">
        {submitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
