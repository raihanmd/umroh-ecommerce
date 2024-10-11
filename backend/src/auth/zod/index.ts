import { z } from "zod";

export class UsersValidation {
  static LOGIN = z.object({
    phone: z
      .string()
      .min(1, "Phone number is required.")
      .max(18, "Phone number is too long."),
    password: z.string().min(1, "Password is required."),
  });

  static RESGISTER = this.LOGIN.extend({
    name: z.string().min(1, "Name is required.").max(50, "Name is too long."),
    email: z
      .string()
      .email("Invalid email address.")
      .max(255, "Email is too long."),
    confirm_password: z.string().min(1),
  }).superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirm_password"],
      });
    }
  });

  static VERIFY_OTP = z.object({
    verify_token: z.string().min(1),
    otp: z.string().min(1),
  });
}
