import { redirect } from "next/navigation";
import { getCurrentSession, getCurrentShop } from "@/lib/current-shop";
import { resumeOnboardingPath } from "@/lib/onboarding";
import { SidebarContent } from "@/components/dashboard/sidebar-content";
import { MobileTopBar } from "@/components/dashboard/mobile-topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const shop = await getCurrentShop();

  if (shop?.onboardingStep !== "completed") {
    redirect(resumeOnboardingPath(shop?.onboardingStep ?? null));
  }

  return (
    <div className="flex h-svh w-full overflow-hidden">
      <aside className="hidden w-64 shrink-0 flex-col overflow-y-auto border-r bg-sidebar px-3 py-6 sm:flex">
        <SidebarContent shopName={shop.name} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar shopName={shop.name} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
