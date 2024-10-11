"use server";

import { cookies } from "next/headers";
import { fetchInstance } from "~/lib/fetch";
import { TOrder } from "~/types/order";

export const userGetOrder = async () => {
  return (await (
    await fetchInstance("/user/order", {
      headers: {
        Authorization: `Bearer ${cookies().get("access_token")?.value}`,
      },
      next: {
        tags: ["orders"],
        revalidate: 10,
      },
    })
  ).json()) as {
    payload: TOrder[];
  };
};

export const adminGetOrder = async () => {
  return (await (
    await fetchInstance("/order", {
      headers: {
        Authorization: `Bearer ${cookies().get("access_token")?.value}`,
      },
      next: {
        tags: ["orders"],
        revalidate: 10,
      },
    })
  ).json()) as {
    payload: TOrder[];
  };
};
