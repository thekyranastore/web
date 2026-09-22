"use client";

import { useState } from "react";
import Image from "next/image";
import { PackageIcon } from "@phosphor-icons/react";
import { getYoutubeEmbedUrl } from "@/lib/youtube";

export function ProductGallery({
  imageUrls,
  videoUrl,
  name,
}: {
  imageUrls: string[];
  videoUrl: string | null;
  name: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const embedUrl = videoUrl ? getYoutubeEmbedUrl(videoUrl) : null;

  if (imageUrls.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-muted">
        <PackageIcon className="size-10 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-xl bg-muted">
        <Image
          src={imageUrls[activeIndex]}
          alt={name}
          width={500}
          height={500}
          className="size-full object-cover"
          priority
        />
      </div>
      {(imageUrls.length > 1 || embedUrl) && (
        <div className="flex gap-2">
          {imageUrls.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`size-14 shrink-0 overflow-hidden rounded-lg ring-2 ${
                index === activeIndex ? "ring-primary" : "ring-transparent"
              }`}
            >
              <Image src={url} alt="" width={56} height={56} className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {embedUrl && (
        <div className="aspect-video overflow-hidden rounded-xl">
          <iframe
            src={embedUrl}
            title={`${name} video`}
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
