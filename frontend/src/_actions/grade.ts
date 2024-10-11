"use server";

import kyInstance from "~/lib/ky";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { createGradeSchema } from "~/schema/grade.schema";

export async function createGradeAction(
  data: z.infer<typeof createGradeSchema>,
) {
  try {
    await kyInstance
      .post<{ payload: { token: string } }>(`grades`, {
        json: data,
        headers: {
          Authorization: `Bearer ${cookies().get("access_token")?.value}`,
        },
      })
      .json();

    revalidateTag("grades");

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.errors || "Create grade failed" };
  }
}

export async function updateGradeAction(
  data: z.infer<typeof createGradeSchema>,
  id: string,
) {
  try {
    await kyInstance
      .put<{ payload: { token: string } }>(`grades/${id}`, {
        json: data,
        headers: {
          Authorization: `Bearer ${cookies().get("access_token")?.value}`,
        },
      })
      .json();

    revalidateTag("grades");

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.errors || "Update grade failed" };
  }
}

export async function deleteGradeAction(id: string) {
  try {
    await kyInstance
      .delete<{ payload: { token: string } }>(`grades/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies().get("access_token")?.value}`,
        },
      })
      .json();

    revalidateTag("grades");

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.errors || "Delete grade failed" };
  }
}
