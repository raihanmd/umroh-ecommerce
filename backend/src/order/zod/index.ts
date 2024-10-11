import { z } from "zod";

export class OrderValidation {
  static CREATE = z.object({
    user_id: z.string(),
    items: z.array(z.string()),
  });
}
