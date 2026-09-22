import { z } from "zod";

export const orderAddressSchema = z.object({
  line1: z.string().min(3, "Address is too short"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter a valid 6-digit pincode"),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is too short"),
  customerPhone: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
  address: orderAddressSchema,
});

export const orderStatusEnum = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const orderStatusTransitions: Record<
  (typeof orderStatusEnum)[number],
  (typeof orderStatusEnum)[number][]
> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const updateOrderStatusSchema = z.object({
  orderId: z.uuid(),
  status: z.enum(orderStatusEnum),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
