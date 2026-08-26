import { z } from "zod";

export const specificationSchema = z.object({
  specDefinitionId: z
    .number({ message: "Specification definition is required" })
    .min(1, "Select a specification definition"),
  specValue: z.string().min(1, "Value is required"),
});

export const storeAvailabilitySchema = z.object({
  storeId: z.number({ message: "Store is required" }).min(1, "Select a store"),
  price: z
    .number({ message: "Price is required" })
    .positive("Price must be greater than 0"),
  stockStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK", "PRE_ORDER"]),
  productUrl: z.string().url("Must be a valid URL"),
});

export const variantSchema = z.object({
  ramGb: z
    .number({ message: "RAM size is required" })
    .min(1, "RAM must be at least 1 GB"),
  storageGb: z
    .number({ message: "Storage size is required" })
    .min(1, "Storage must be at least 1 GB"),
  availability: z
    .array(storeAvailabilitySchema)
    .min(1, "Add at least one store availability record"),
});

export const mobileImageSchema = z.object({
  imageUrl: z.string().url("Must be a valid image URL"),
  imageType: z.enum(["FRONT", "BACK", "SIDE"]),
  isPrimary: z.boolean(),
  displayOrder: z.number().min(0, "Display order must be 0 or greater"),
});

export const mobileFormSchema = z.object({
  brandId: z
    .number({ message: "Brand selection is required" })
    .min(1, "Select a brand"),
  mobileName: z.string().min(2, "Mobile name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  launchDate: z.string().min(1, "Launch date is required"),
  status: z.enum(["Available", "Coming Soon", "Rumored"]),
  specifications: z
    .array(specificationSchema)
    .min(1, "Add at least one specification"),
  variants: z
    .array(variantSchema)
    .min(1, "Add at least one RAM/Storage variant"),
  images: z.array(mobileImageSchema).min(1, "Add at least one image"),
});

export type MobileFormValues = z.infer<typeof mobileFormSchema>;
