import { z } from "zod";

export const createSaleSchema = z.object({
  sellerId: z.uuid("ID do vendedor inválido"),
  amount: z.coerce
    .number()
    .min(0.01, "O valor da venda deve ser maior que zero"),
  description: z.string().optional(),
});

export const createSaleResponseSchema = z.object({
  id: z.uuid(),
  sellerId: z.uuid(),
  amount: z.string(),
  totalCommissionSeller: z.string(),
  ruleDescriptionSeller: z.string().nullable(),
  totalCommissionManager: z.string(),
  ruleDescriptionManager: z.string().nullable(),
  saleDate: z.string(),
  description: z.string().nullable().optional(),
});

export const CreateSaleRequestSchema = z.object({
  sellerId: z.string(),
  amount: z.number(),
  description: z.string().optional(),
});

export const updateSaleSchema = z.object({
  sellerId: z.string().optional(),
  amount: z.number().optional(),
  description: z.string().optional(),
});

export type UpdateSaleRequestDTO = z.infer<typeof updateSaleSchema>;
export type UpdateSaleResponseDTO = z.infer<typeof createSaleResponseSchema>;

export type CreateSaleRequestDTO = z.infer<typeof CreateSaleRequestSchema>;

export type CreateSaleDTO = z.infer<typeof createSaleSchema>;

export const listSalesResponseSchema = z.array(
  z.object({
    id: z.string(),
    sellerId: z.string(),
    amount: z.string(),
    date: z.string(),
    description: z.string().nullable(),
    sellerName: z.string(),
    sellerComm: z.string(),
    sellerFixed: z.string(),
    sellerPercent: z.string(),
    managerComm: z.string(),
    managerFixed: z.string(),
    managerPercent: z.string(),
    ruleDescriptionSeller: z.string().nullable(),
    ruleDescriptionManager: z.string().nullable(),
  }),
);
