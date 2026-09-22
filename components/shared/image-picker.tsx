"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/upload-image";

export function ImagePicker({
  folder,
  value,
  onChange,
}: {
  folder: "products" | "shops";
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);

    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch {
      toast.error("Could not upload the image");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {value && (
        <Image
          src={value}
          alt=""
          width={56}
          height={56}
          className="size-14 rounded-md object-cover"
        />
      )}
      <div className="flex flex-col gap-1">
        <input
          id="image-upload"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          {uploading ? "Uploading..." : value ? "Change photo" : "Add photo"}
        </Button>
      </div>
    </div>
  );
}
