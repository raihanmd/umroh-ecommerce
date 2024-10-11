"use server";

import { cookies } from "next/headers";
import { fetchInstance } from "~/lib/fetch";
import { TUserWithDetail } from "~/types/user";

export const adminGetUser = async () => {
  return (await (
    await fetchInstance("/user", {
      headers: {
        Authorization: `Bearer ${cookies().get("access_token")?.value}`,
      },
      next: {
        tags: ["users"],
        revalidate: 10,
      },
    })
  ).json()) as {
    payload: TUserWithDetail[];
  };
};
