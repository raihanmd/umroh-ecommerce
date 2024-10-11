import { z } from "zod";

export class CartValidation {
  static CREATE = z.object({
    user_id: z.string().min(1, "User ID is required."),
    umrah_package_id: z.string().min(1, "Package ID is required."),
    quantity: z.number().min(1, "Quantity must be at least 1"),
  });

  static UPDATE = z.object({
    user_id: z.string().min(1, "User ID is required."),
    umrah_package_id: z.string().min(1, "Package ID is required."),
    quantity: z.number().min(1, "Quantity must be at least 1"),
  });

  static DELETE = z.object({
    umrah_package_id: z.string().min(1),
  });
}

export type CreateCartValidationType = z.infer<typeof CartValidation.CREATE>;
export type UpdateCartValidationType = z.infer<typeof CartValidation.UPDATE>;
