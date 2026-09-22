import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { getCurrentSession } from "@/lib/current-shop";

export default async function Home() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_40%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/15 blur-[120px]"
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10">
        <Logo className="h-5 w-auto" />
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">Log in</Link>
        </Button>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Your shop, <span className="text-primary">online</span> in minutes.
        </h1>
        <p className="max-w-sm text-base text-muted-foreground text-balance">
          A storefront for your business — set up once, sell anywhere.
        </p>
        <Button asChild size="lg" className="h-11 rounded-full px-8">
          <Link href="/signup">Start selling</Link>
        </Button>
      </main>

      <footer className="relative z-10 px-6 py-6 text-center text-xs text-muted-foreground sm:px-10">
        Kirana
      </footer>
    </div>
  );
}
