import { z } from "zod";

const youtubeUrlPattern = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

export const productSchema = z.object({
  name: z.string().min(2, "Name is too short").max(120),
  description: z.string().max(2000).optional(),
  pricePaise: z.number().int().min(1, "Enter a price"),
  stockQty: z.number().int().min(0),
  imageUrls: z.array(z.url()).max(4, "Up to 4 photos allowed"),
  videoUrl: z
    .string()
    .regex(youtubeUrlPattern, "Enter a valid YouTube link")
    .optional()
    .or(z.literal("")),
});

export const firstProductSchema = z.object({
  name: z.string().min(2, "Name is too short").max(120),
  pricePaise: z.number().int().min(1, "Enter a price"),
  stockQty: z.number().int().min(0),
  imageUrl: z.url().optional().or(z.literal("")),
});

export type ProductInput = z.infer<typeof productSchema>;
export type FirstProductInput = z.infer<typeof firstProductSchema>;
