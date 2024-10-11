import { z } from "zod";

export const createCatalogSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(255, {
    message: "Name must be less than 255 characters",
  }),
  ustadz_id: z
    .string()
    .min(1, { message: "Ustadz is required" })
    .describe("Ustadz"),
  grade_id: z
    .string()
    .min(1, { message: "Grade is required" })
    .describe("Grade"),
  price: z
    .number()
    .int()
    .min(1, { message: "Price is required" })
    .positive("Price must be positive"),
  description: z.string().min(1, { message: "Description is required" }),
  photo_urls: z.array(z.instanceof(File)),
  video_urls: z.array(z.instanceof(File)),
});
