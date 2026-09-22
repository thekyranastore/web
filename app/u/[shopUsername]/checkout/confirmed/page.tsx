import Link from "next/link";
import { CheckCircleIcon as CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export default async function OrderConfirmedPage({
  params,
}: {
  params: Promise<{ shopUsername: string }>;
}) {
  const { shopUsername } = await params;

  return (
    <div className="flex flex-col items-center gap-4 p-8 text-center sm:p-16">
      <CheckCircle className="size-14 text-emerald-500" weight="fill" />
      <h1 className="text-2xl font-bold">Order placed</h1>
      <p className="text-muted-foreground">The store will contact you shortly to confirm.</p>
      <Button asChild variant="outline" className="h-11 rounded-full">
        <Link href={`/u/${shopUsername}`}>Continue shopping</Link>
      </Button>
    </div>
  );
}
