import { redirect } from "next/navigation";
import { db } from "@/db";
import { shopCategories } from "@/db/schema";
import { getCurrentShop } from "@/lib/current-shop";
import { resumeOnboardingPath } from "@/lib/onboarding";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryGrid } from "./category-grid";

export default async function OnboardingCategoryPage() {
  const shop = await getCurrentShop();
  const expectedPath = resumeOnboardingPath(shop?.onboardingStep ?? null);

  if (expectedPath !== "/onboarding/category") {
    redirect(expectedPath);
  }

  const categories = await db.select().from(shopCategories);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-start p-4 pt-10 sm:justify-center sm:pt-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <StepIndicator current={2} />
          <CardTitle className="text-xl">What does your shop sell?</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryGrid categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
