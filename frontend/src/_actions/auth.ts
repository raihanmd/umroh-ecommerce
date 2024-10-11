"use server";
import kyInstance from "~/lib/ky";
import { cookies } from "next/headers";
import { z } from "zod";
import { loginSchema, registerSchema } from "~/schema/auth.schema";
import { env } from "~/env";
import { clearVerifyToken } from "~/lib/jwt";
import { redirect } from "next/navigation";

export async function loginAction(data: z.infer<typeof loginSchema>) {
  try {
    const res = await kyInstance
      .post<{ payload: { token: string } }>(`auth/login`, {
        json: data,
      })
      .json();

    cookies().set("access_token", res.payload.token);

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.errors || "Username or password wrong",
    };
  }
}

export async function registerAdmin(data: z.infer<typeof registerSchema>) {
  try {
    await kyInstance
      .post(`auth/register`, {
        json: data,
        headers: {
          "x-admin-token": env.ADMIN_TOKEN,
        },
      })
      .json();

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.errors || "Phone or email already taken",
    };
  }
}

export async function registerMember(data: z.infer<typeof registerSchema>) {
  try {
    const res = await kyInstance
      .post<{ payload: { verify_token: string } }>(`auth/register`, {
        json: data,
      })
      .json();

    cookies().set("verify_token", res.payload.verify_token);

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.errors || "Phone or email already taken",
    };
  }
}

export async function verifyOtp(otp: string) {
  try {
    console.log(cookies().get("verify_token")?.value);

    await kyInstance
      .post<{ payload: { verify_token: string } }>(`auth/verify`, {
        json: {
          verify_token: cookies().get("verify_token")?.value,
          otp,
        },
      })
      .json();

    await clearVerifyToken();

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.errors || "OTP wrong",
    };
  }
}

export async function logout() {
  cookies().delete("access_token");
  redirect("/");
}
