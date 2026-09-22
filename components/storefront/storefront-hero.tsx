import Image from "next/image";
import { getYoutubeEmbedUrl } from "@/lib/youtube";

export function StorefrontHero({
  bannerUrls,
  bannerVideoUrl,
}: {
  bannerUrls: string[];
  bannerVideoUrl: string | null;
}) {
  const embedUrl = bannerVideoUrl ? getYoutubeEmbedUrl(bannerVideoUrl) : null;

  if (bannerUrls.length === 0 && !embedUrl) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-0">
      {bannerUrls.length > 0 && (
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto">
          {bannerUrls.map((url) => (
            <div
              key={url}
              className="aspect-[16/7] w-full shrink-0 snap-start overflow-hidden rounded-xl bg-muted sm:w-[calc(100%-2rem)]"
            >
              <Image
                src={url}
                alt=""
                width={1200}
                height={525}
                className="size-full object-cover"
                priority
              />
            </div>
          ))}
        </div>
      )}
      {embedUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-xl">
          <iframe
            src={embedUrl}
            title="Store video"
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
