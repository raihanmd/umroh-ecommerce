"use server";

import { TCart } from "./../types/cart";
import kyInstance from "~/lib/ky";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { fetchInstance } from "~/lib/fetch";

export async function createCart({
  umrah_package_id,
  quantity,
}: {
  umrah_package_id: string;
  quantity: number;
}) {
  try {
    await kyInstance
      .post(`carts`, {
        json: { umrah_package_id, quantity },
        headers: {
          Authorization: `Bearer ${cookies().get("access_token")?.value}`,
        },
      })
      .json();

    revalidateTag("carts");

    return { success: true };
  } catch (error: any) {
    switch (error.response.status) {
      case 403:
        return { forbidden: true };
      case 401:
        return { mustLogin: true };
      default:
        return {
          success: false,
          message: error.errors || "Add to cart failed",
        };
    }
  }
}

export async function updateCart({
  umrah_package_id,
  quantity,
}: {
  umrah_package_id: string;
  quantity: number;
}) {
  try {
    await kyInstance
      .put(`carts`, {
        json: { umrah_package_id, quantity },
        headers: {
          Authorization: `Bearer ${cookies().get("access_token")?.value}`,
        },
      })
      .json();

    revalidateTag("carts");

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.errors || "Add to cart failed",
    };
  }
}

export async function deleteCart(umrah_package_id: string) {
  try {
    await kyInstance
      .delete(`carts`, {
        json: { umrah_package_id },
        headers: {
          Authorization: `Bearer ${cookies().get("access_token")?.value}`,
        },
      })
      .json();

    revalidateTag("carts");

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.errors || "Add to cart failed",
    };
  }
}

export const userGetCart = async () => {
  return (await (
    await fetchInstance("/user/cart", {
      headers: {
        Authorization: `Bearer ${cookies().get("access_token")?.value}`,
      },
      next: {
        tags: ["carts"],
        revalidate: 10,
      },
    })
  ).json()) as {
    payload: TCart[];
  };
};

export const adminGetCart = async () => {
  return (await (
    await fetchInstance("/cart", {
      headers: {
        Authorization: `Bearer ${cookies().get("access_token")?.value}`,
      },
      next: {
        tags: ["carts"],
        revalidate: 10,
      },
    })
  ).json()) as {
    payload: TCart[];
  };
};
