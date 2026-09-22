import { z } from "zod";

const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export const shopDetailsSchema = z.object({
  name: z.string().min(2, "Shop name is too short").max(80),
  username: z
    .string()
    .min(3, "Must be at least 3 characters")
    .max(30)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  gstin: z
    .string()
    .toUpperCase()
    .regex(gstinRegex, "GSTIN format looks incorrect"),
});

export const shopCategorySchema = z.object({
  categoryId: z.uuid("Choose a category"),
});

export const shopProfileSchema = z.object({
  name: z.string().min(2, "Shop name is too short").max(80),
  description: z.string().max(500).optional(),
  logoUrl: z.url().optional().or(z.literal("")),
});

const youtubeUrlPattern = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

export const shopAppearanceSchema = z.object({
  bannerUrls: z.array(z.url()).max(4, "Up to 4 banners allowed"),
  bannerVideoUrl: z
    .string()
    .regex(youtubeUrlPattern, "Enter a valid YouTube link")
    .optional()
    .or(z.literal("")),
  accentColor: z
    .string()
    .regex(hexColorPattern, "Enter a valid hex color")
    .optional()
    .or(z.literal("")),
});

export type ShopDetailsInput = z.infer<typeof shopDetailsSchema>;
export type ShopCategoryInput = z.infer<typeof shopCategorySchema>;
export type ShopProfileInput = z.infer<typeof shopProfileSchema>;
export type ShopAppearanceInput = z.infer<typeof shopAppearanceSchema>;
