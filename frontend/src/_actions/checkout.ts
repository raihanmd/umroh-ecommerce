"use server";

import { cookies } from "next/headers";
import kyInstance from "~/lib/ky";
import { revalidateTag } from "next/cache";

export async function checkout(items: string[]) {
  try {
    await kyInstance
      .post<{ payload: { token: string } }>(`order`, {
        json: { items },
        headers: {
          Authorization: `Bearer ${cookies().get("access_token")?.value}`,
        },
      })
      .json();

    revalidateTag("carts");
    revalidateTag("orders");

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.errors || "Checkout failed" };
  }
}
