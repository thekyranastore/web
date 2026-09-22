"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiImagePicker } from "@/components/shared/multi-image-picker";
import { updateShopAppearance } from "@/actions/shops";
import { shopAppearanceSchema, type ShopAppearanceInput } from "@/lib/validations/shop";

export function StoreAppearanceForm({
  defaultValues,
}: {
  defaultValues: Partial<ShopAppearanceInput>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [bannerUrls, setBannerUrls] = useState(defaultValues.bannerUrls ?? []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ShopAppearanceInput>({
    resolver: zodResolver(shopAppearanceSchema),
    defaultValues: { bannerUrls: [], ...defaultValues },
  });

  async function onSubmit(values: ShopAppearanceInput) {
    setSubmitting(true);
    const result = await updateShopAppearance({ ...values, bannerUrls });
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Store appearance updated");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Banner images (up to 4)</Label>
        <p className="text-sm text-muted-foreground">
          Shown as a hero carousel at the top of your storefront.
        </p>
        <MultiImagePicker folder="shops" value={bannerUrls} onChange={setBannerUrls} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bannerVideoUrl">YouTube video (optional)</Label>
        <p className="text-sm text-muted-foreground">
          Embedded below your banners — great for an intro or product showcase.
        </p>
        <Input
          id="bannerVideoUrl"
          placeholder="https://youtube.com/watch?v=..."
          {...register("bannerVideoUrl")}
        />
        {errors.bannerVideoUrl && (
          <p className="text-sm text-destructive">{errors.bannerVideoUrl.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="accentColor">Accent color</Label>
        <p className="text-sm text-muted-foreground">
          Used for buttons and highlights on your storefront.
        </p>
        <Controller
          control={control}
          name="accentColor"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="size-9 shrink-0 rounded-md border"
                value={field.value || "#ff6719"}
                onChange={(event) => field.onChange(event.target.value)}
              />
              <Input
                placeholder="#FF6719"
                className="max-w-32"
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            </div>
          )}
        />
        {errors.accentColor && (
          <p className="text-sm text-destructive">{errors.accentColor.message}</p>
        )}
      </div>

      <Button type="submit" disabled={submitting} className="rounded-full">
        {submitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
