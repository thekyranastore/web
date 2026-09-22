import { z } from "zod";

export const presignRequestSchema = z.object({
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  folder: z.enum(["products", "shops"]),
});

export type PresignRequest = z.infer<typeof presignRequestSchema>;
