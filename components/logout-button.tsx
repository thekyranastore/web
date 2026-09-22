"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      className="h-auto w-full justify-start rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-background hover:text-foreground"
      onClick={handleLogout}
    >
      Log out
    </Button>
  );
}
