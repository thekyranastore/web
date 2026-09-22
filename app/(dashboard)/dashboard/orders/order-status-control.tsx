"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateOrderStatus } from "@/actions/orders";
import { orderStatusTransitions } from "@/lib/validations/order";

type OrderStatus = keyof typeof orderStatusTransitions;

export function OrderStatusControl({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const nextStatuses = orderStatusTransitions[currentStatus];
  const [selected, setSelected] = useState<OrderStatus | "">("");
  const [submitting, setSubmitting] = useState(false);

  if (nextStatuses.length === 0) {
    return null;
  }

  async function handleUpdate() {
    if (!selected) {
      return;
    }

    setSubmitting(true);
    const result = await updateOrderStatus({ orderId, status: selected });
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(`Order marked as ${selected}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={selected} onValueChange={(value) => setSelected(value as OrderStatus)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Update status" />
        </SelectTrigger>
        <SelectContent>
          {nextStatuses.map((status) => (
            <SelectItem key={status} value={status} className="capitalize">
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleUpdate} disabled={!selected || submitting} className="rounded-full">
        {submitting ? "Updating..." : "Update"}
      </Button>
    </div>
  );
}
