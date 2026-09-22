import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "destructive" | "muted" | "primary";

const toneClasses: Record<Tone, string> = {
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  destructive: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  muted: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
};

const orderStatusTone: Record<string, Tone> = {
  pending: "warning",
  confirmed: "primary",
  shipped: "primary",
  delivered: "success",
  cancelled: "destructive",
};

const productStatusTone: Record<string, Tone> = {
  draft: "muted",
  active: "success",
  archived: "muted",
};

const paymentStatusTone: Record<string, Tone> = {
  unpaid: "warning",
  paid: "success",
};

function StatusBadge({ status, tone }: { status: string; tone: Tone }) {
  return (
    <Badge variant="outline" className={cn("border-transparent capitalize", toneClasses[tone])}>
      {status}
    </Badge>
  );
}

export function OrderStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} tone={orderStatusTone[status] ?? "muted"} />;
}

export function ProductStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} tone={productStatusTone[status] ?? "muted"} />;
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return <StatusBadge status={status} tone={paymentStatusTone[status] ?? "muted"} />;
}
