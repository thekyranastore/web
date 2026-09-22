import { redirect } from "next/navigation";
import { getCurrentShop } from "@/lib/current-shop";
import { resumeOnboardingPath } from "@/lib/onboarding";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FirstProductForm } from "./first-product-form";

export default async function OnboardingFirstProductPage() {
  const shop = await getCurrentShop();
  const expectedPath = resumeOnboardingPath(shop?.onboardingStep ?? null);

  if (expectedPath !== "/onboarding/first-product") {
    redirect(expectedPath);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-start p-4 pt-10 sm:justify-center sm:pt-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-4">
          <StepIndicator current={3} />
          <CardTitle className="text-xl">Add your first product</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            You can add more details and products later — this just gets your store live.
          </p>
          <FirstProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
