"use server";

import { revalidateTag } from "next/cache";

export const revalidateTags = (tag: string) => {
  revalidateTag(tag);
};
