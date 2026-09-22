import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Kirana</h1>
        <p className="text-muted-foreground">
          Set up your shop and start selling online in minutes.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/signup">Start selling</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/login">Log in</Link>
        </Button>
      </div>
    </div>
  );
}
