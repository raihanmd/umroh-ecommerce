import { z } from "zod";

export const createGradeSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});
