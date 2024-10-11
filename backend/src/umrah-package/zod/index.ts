import { MAX_PHOTO_SIZE } from "config/common/max-photo-size";
import { MAX_VIDEO_SIZE } from "config/common/max-video-size";
import { PHOTO_MIME_TYPES } from "config/common/photo-mime-type";
import { VIDEO_MIME_TYPES } from "config/common/video-mime-type";
import { PaginationSchema } from "src/common/zod";
import { z } from "zod";

export class UmrahPackageValidation {
  static CREATE = z.object({
    ustadz_id: z
      .string()
      .min(1, "Ustadz ID is required.")
      .max(30, "Ustadz ID is too long."),
    grade_id: z
      .string()
      .min(1, "Grade ID is required.")
      .max(30, "Grade ID is too long."),
    name: z.string().min(1, "Name is required.").max(255, "Name is too long."),
    description: z.string().min(1, "Description is required."),
    price: z
      .number()
      .min(1, "Price must be at least 1")
      .positive("Price must be greater than 0"),
    photo_urls: z.array(z.any()).superRefine((files, ctx) => {
      files.forEach((f) => {
        if (!PHOTO_MIME_TYPES.includes(f.mimetype)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Photo must be one of [${PHOTO_MIME_TYPES.join(", ")}] but was ${f.mimetype}`,
          });
        }
        if (f.size > MAX_PHOTO_SIZE) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            type: "array",
            message: `The photo must not be larger than ${MAX_PHOTO_SIZE} bytes: ${f.size}`,
            maximum: MAX_PHOTO_SIZE,
            inclusive: true,
          });
        }
      });
    }),
    video_urls: z.array(z.any()).superRefine((files, ctx) => {
      files.forEach((f) => {
        if (!VIDEO_MIME_TYPES.includes(f.mimetype)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Video must be one of [${VIDEO_MIME_TYPES.join(", ")}] but was ${f.mimetype}`,
          });
        }
        if (f.size > MAX_VIDEO_SIZE) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            type: "array",
            message: `The video must not be larger than ${MAX_VIDEO_SIZE}`,
            maximum: MAX_VIDEO_SIZE,
            inclusive: true,
          });
        }
      });
    }),
  });

  static UPDATE = this.CREATE;

  static DELETE = z.object({
    id: z.string().min(1, "ID is required."),
  });

  static QUERY = PaginationSchema.extend({
    name: z.string().min(1, "Name is required.").optional(),
  });
}
