"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/upload-image";

const MAX_IMAGES = 4;

export function MultiImagePicker({
  folder,
  value,
  onChange,
}: {
  folder: "products" | "shops";
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploading(true);

    try {
      const url = await uploadImage(file, folder);
      onChange([...value, url]);
    } catch {
      toast.error("Could not upload the image");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-wrap gap-3">
      {value.map((url, index) => (
        <div key={url} className="group relative size-16 shrink-0">
          <Image src={url} alt="" fill className="rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => removeAt(index)}
            className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-background"
          >
            <XIcon className="size-3" />
          </button>
        </div>
      ))}

      {value.length < MAX_IMAGES && (
        <label className="flex size-16 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground hover:bg-muted">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={handleFileChange}
          />
          {uploading ? "..." : "+ Add"}
        </label>
      )}
    </div>
  );
}
