import Link from "next/link";
import { getCurrentShop } from "@/lib/current-shop";
import { getStoreUrl } from "@/lib/store-url";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CopyField } from "@/components/shared/copy-field";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ShopProfileForm } from "./shop-profile-form";
import { StoreAppearanceForm } from "./store-appearance-form";

export default async function SettingsPage() {
  const shop = await getCurrentShop();

  if (!shop) {
    return null;
  }

  const storeUrl = await getStoreUrl(shop.username);

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Settings" />

      <div className="p-4 sm:p-6">
        <Tabs defaultValue="general">
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <TabsList variant="line">
              <TabsTrigger value="general" className="rounded-full">
                General
              </TabsTrigger>
              <TabsTrigger value="appearance" className="rounded-full">
                Appearance
              </TabsTrigger>
              <TabsTrigger value="payments" className="rounded-full">
                Payments
              </TabsTrigger>
              <TabsTrigger value="delivery" className="rounded-full">
                Delivery
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="general" className="max-w-2xl pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Shop profile</CardTitle>
                <CardDescription>Your name and description as customers see it</CardDescription>
              </CardHeader>
              <CardContent>
                <ShopProfileForm
                  defaultValues={{
                    name: shop.name,
                    description: shop.description ?? undefined,
                    logoUrl: shop.logoUrl ?? undefined,
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="flex max-w-2xl flex-col gap-6 pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Storefront link</CardTitle>
                <CardDescription>Share this with your customers</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <CopyField value={storeUrl} />
                <Button asChild variant="outline" className="w-fit rounded-full">
                  <Link href={storeUrl} target="_blank">
                    View store
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Store appearance</CardTitle>
                <CardDescription>Customize how your storefront looks to customers</CardDescription>
              </CardHeader>
              <CardContent>
                <StoreAppearanceForm
                  defaultValues={{
                    bannerUrls: shop.bannerUrls,
                    bannerVideoUrl: shop.bannerVideoUrl ?? undefined,
                    accentColor: shop.accentColor ?? undefined,
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="max-w-2xl pt-6">
            <Card className="opacity-60">
              <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>Coming soon — add a bank account to receive payouts</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="delivery" className="max-w-2xl pt-6">
            <Card className="opacity-60">
              <CardHeader>
                <CardTitle>Delivery</CardTitle>
                <CardDescription>Coming soon — connect to our in-house delivery service</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
