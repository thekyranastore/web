import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { LogoutButton } from "@/components/logout-button";
import { Logo } from "@/components/shared/logo";

export function SidebarContent({ shopName }: { shopName: string }) {
  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <div className="flex flex-col gap-8">
        <Logo className="h-5 w-auto self-start px-3" />
        <SidebarNav />
      </div>
      <div className="flex flex-col gap-1 rounded-xl border bg-sidebar-accent/40 p-2">
        <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {shopName.charAt(0).toUpperCase()}
          </div>
          <span className="truncate text-sm font-medium text-foreground">{shopName}</span>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
