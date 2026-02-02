import { z } from "zod";

export const errorSchema = z.object({
  message: z.string(),
});

export type ErrorDTO = z.infer<typeof errorSchema>;
