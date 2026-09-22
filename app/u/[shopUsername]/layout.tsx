import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { shops } from "@/db/schema";
import { CartProvider } from "@/components/storefront/cart-provider";
import { CartLink } from "@/components/storefront/cart-link";

export const revalidate = 60;

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ shopUsername: string }>;
}) {
  const { shopUsername } = await params;

  const [shop] = await db
    .select()
    .from(shops)
    .where(and(eq(shops.username, shopUsername), eq(shops.status, "active")))
    .limit(1);

  if (!shop) {
    notFound();
  }

  return (
    <CartProvider shopUsername={shopUsername}>
      <div
        className="flex min-h-screen flex-col bg-background"
        style={shop.accentColor ? ({ "--primary": shop.accentColor } as React.CSSProperties) : undefined}
      >
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Link href={`/u/${shopUsername}`} className="flex min-w-0 items-center gap-2">
              {shop.logoUrl ? (
                <Image
                  src={shop.logoUrl}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {shop.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="truncate font-bold">{shop.name}</span>
            </Link>
            <CartLink />
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1">{children}</main>
        <footer className="border-t py-6 text-center text-xs text-muted-foreground">
          Powered by Kirana
        </footer>
      </div>
    </CartProvider>
  );
}
