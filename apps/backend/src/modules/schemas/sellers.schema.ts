import { z } from "zod";

export const SellerListResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  fixedCommission: z.string(),
  percentageCommission: z.string(),
});

export const SellerCreateResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  fixedCommission: z.string(),
  percentageCommission: z.string(),
});

export const SellerCreateRequestSchema = z.object({
  name: z.string(),
  email: z.email(),
  fixedCommission: z.string(),
  percentageCommission: z.string(),
});

export const SellerUpdateRequestSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  fixedCommission: z.string().optional(),
  percentageCommission: z.string().optional(),
});

export const SellerUpdateResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  fixedCommission: z.string(),
  percentageCommission: z.string(),
});

export const SellerDeleteResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  fixedCommission: z.string(),
  percentageCommission: z.string(),
});

export type CreateSellerDTO = z.infer<typeof SellerCreateRequestSchema>;
export type UpdateSellerDTO = z.infer<typeof SellerUpdateRequestSchema>;
