import type { shops } from "@/db/schema";

export type OnboardingStep = (typeof shops.$inferSelect)["onboardingStep"];

export function resumeOnboardingPath(step: OnboardingStep | null) {
  switch (step) {
    case null:
      return "/onboarding/shop";
    case "shop_details":
      return "/onboarding/category";
    case "category":
      return "/onboarding/first-product";
    case "first_product":
    case "completed":
      return "/dashboard";
  }
}
