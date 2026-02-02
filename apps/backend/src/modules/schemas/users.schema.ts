import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(3).optional(),
  managerFixedCommission: z.coerce.number().min(0).optional(),
  managerPercentCommission: z.coerce.number().min(0).max(100).optional(),
  image: z.url().optional(),
});

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
