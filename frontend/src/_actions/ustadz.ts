"use server";
import kyInstance from "~/lib/ky";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { createUstadzSchema } from "~/schema/ustadz.schema";

export async function createUstadzAction(
  data: z.infer<typeof createUstadzSchema>,
) {
  try {
    await kyInstance
      .post<{ payload: { token: string } }>(`ustadzs`, {
        json: data,
        headers: {
          Authorization: `Bearer ${cookies().get("access_token")?.value}`,
        },
      })
      .json();

    revalidateTag("ustadzs");

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.errors || "Create ustdaz failed" };
  }
}

export async function updateUstadzAction(
  data: z.infer<typeof createUstadzSchema>,
  id: string,
) {
  try {
    await kyInstance
      .put<{ payload: { token: string } }>(`ustadzs/${id}`, {
        json: data,
        headers: {
          Authorization: `Bearer ${cookies().get("access_token")?.value}`,
        },
      })
      .json();

    revalidateTag("ustadzs");

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.errors || "Update grade failed" };
  }
}

export async function deleteUstadzAction(id: string) {
  try {
    await kyInstance
      .delete<{ payload: { token: string } }>(`ustadzs/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies().get("access_token")?.value}`,
        },
      })
      .json();

    revalidateTag("ustadzs");

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.errors || "Delete ustadz failed" };
  }
}
