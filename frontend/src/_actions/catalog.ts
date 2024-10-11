"use server";
import kyInstance from "~/lib/ky";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export async function deleteCatalogAction(id: string) {
  try {
    await kyInstance
      .delete<{ payload: { token: string } }>(`umrah-packages/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies().get("access_token")?.value}`,
        },
      })
      .json();

    revalidateTag("catalogs");

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.errors || "Delete catalog failed" };
  }
}
