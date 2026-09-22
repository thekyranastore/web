"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { orderStatusEnum } from "@/lib/validations/order";

const statusFilters = ["all", ...orderStatusEnum] as const;

export function OrdersFilterBar({
  defaultQuery,
  defaultStatus,
}: {
  defaultQuery: string;
  defaultStatus: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParams(next: { q?: string; status?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
    }
    if (next.status !== undefined) {
      if (next.status && next.status !== "all") params.set("status", next.status);
      else params.delete("status");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (query !== defaultQuery) updateParams({ q: query });
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative max-w-sm flex-1">
        <MagnifyingGlassIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search orders by customer name"
          className="rounded-full pl-9"
        />
      </div>
      <Select
        defaultValue={defaultStatus}
        onValueChange={(value) => updateParams({ status: value })}
      >
        <SelectTrigger className="w-40 rounded-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusFilters.map((filter) => (
            <SelectItem key={filter} value={filter} className="capitalize">
              {filter}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
