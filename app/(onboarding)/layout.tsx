import { redirect } from "next/navigation";
import { getCurrentSession, getCurrentShop } from "@/lib/current-shop";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const shop = await getCurrentShop();

  if (shop?.onboardingStep === "completed") {
    redirect("/dashboard");
  }

  return <div className="min-h-screen">{children}</div>;
}
