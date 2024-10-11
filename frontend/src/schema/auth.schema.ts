import { z } from "zod";

export const loginSchema = z.object({
  phone: z.string().min(1),
  password: z.string().min(1),
});

export const registerSchema = z
  .object({
    phone: z.string().min(1),
    name: z.string().min(1),
    email: z.string().min(1).email(),
    password: z.string().min(1),
    confirm_password: z.string().min(1).describe("Confirm Password"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirm_password"],
      });
    }
  });
