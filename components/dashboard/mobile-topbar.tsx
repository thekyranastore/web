"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ListIcon as List } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/dashboard/sidebar-content";
import { Logo } from "@/components/shared/logo";

export function MobileTopBar({ shopName }: { shopName: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background px-4 py-3 sm:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <Button
          variant="ghost"
          size="icon"
          className="size-11 -ml-2"
          onClick={() => setOpen(true)}
        >
          <List className="size-5" />
        </Button>
        <SheetContent side="left" className="w-64 bg-sidebar px-4 py-6 pt-14">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent shopName={shopName} />
        </SheetContent>
      </Sheet>
      <Logo className="h-5 w-auto" />
    </div>
  );
}
