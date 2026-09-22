import { redirect } from "next/navigation";
import { getCurrentShop } from "@/lib/current-shop";
import { resumeOnboardingPath } from "@/lib/onboarding";
import { ShopDetailsForm } from "./shop-details-form";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OnboardingShopPage() {
  const shop = await getCurrentShop();
  const expectedPath = resumeOnboardingPath(shop?.onboardingStep ?? null);

  if (expectedPath !== "/onboarding/shop") {
    redirect(expectedPath);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-start p-4 pt-10 sm:justify-center sm:pt-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-4">
          <StepIndicator current={1} />
          <CardTitle className="text-xl">Tell us about your shop</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            We ask for your GSTIN to keep the platform compliant and trustworthy — it&apos;s
            never shown to customers.
          </p>
          <ShopDetailsForm />
        </CardContent>
      </Card>
    </div>
  );
}
