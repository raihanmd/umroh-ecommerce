import { z } from "zod";

export const createUstadzSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});
