"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  pageSize,
  totalCount,
}: {
  page: number;
  pageSize: number;
  totalCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (totalPages <= 1) {
    return null;
  }

  function goTo(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} &middot; {totalCount} total
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={page <= 1}
          onClick={() => goTo(page - 1)}
        >
          <CaretLeftIcon className="size-4" />
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={page >= totalPages}
          onClick={() => goTo(page + 1)}
        >
          Next
          <CaretRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
