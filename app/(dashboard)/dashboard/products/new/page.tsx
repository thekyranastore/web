import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProductForm } from "@/components/dashboard/product-form";

export default function NewProductPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Add product" />
      <div className="max-w-lg p-4 sm:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Product details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
