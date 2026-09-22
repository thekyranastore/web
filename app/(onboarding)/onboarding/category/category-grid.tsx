"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackageIcon as Package } from "@phosphor-icons/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { setShopCategory } from "@/actions/shops";

type Category = { id: string; name: string; slug: string };

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [selecting, setSelecting] = useState<string | null>(null);

  async function handleSelect(categoryId: string) {
    setSelecting(categoryId);

    const result = await setShopCategory({ categoryId });

    setSelecting(null);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    router.push("/onboarding/first-product");
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          disabled={selecting !== null}
          onClick={() => handleSelect(category.id)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors hover:border-primary hover:bg-muted",
            selecting === category.id && "opacity-60",
          )}
        >
          <Package className="size-6 text-muted-foreground" />
          {category.name}
        </button>
      ))}
    </div>
  );
}
