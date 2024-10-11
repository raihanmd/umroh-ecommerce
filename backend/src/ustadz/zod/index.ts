import { PaginationSchema } from "src/common/zod";
import { z } from "zod";

export class UstadzValidation {
  static CREATE = z.object({
    name: z.string().min(1, "Name is required.").max(255, "Name is too long."),
    description: z.string().min(1, "Description is required."),
  });

  static UPDATE = this.CREATE;

  static DELETE = z.object({
    id: z.string().min(1, "ID is required."),
  });

  static QUERY = PaginationSchema.extend({
    name: z.string().min(1, "Name is required.").optional(),
  });
}
