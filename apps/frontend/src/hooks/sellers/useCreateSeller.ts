import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { SellerCreateRequestSchema } from "@app/backend/src/modules/schemas/sellers.schema";
import type { z } from "zod";
import { toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";

type SellerCreateRequestSchemaType = z.infer<typeof SellerCreateRequestSchema>;

export const useCreateSeller = () => {
  return useMutation({
    mutationKey: ["create-seller"],
    mutationFn: async ({
      name,
      email,
      fixedCommission,
      percentageCommission,
    }: SellerCreateRequestSchemaType) => {
      const response = await api.api.sellers.post({
        name,
        email,
        fixedCommission,
        percentageCommission,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sellers"],
      });
      toaster.create({
        title: "Vendedor criado com sucesso",
        description: "O vendedor foi criado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Erro ao criar vendedor",
        description: `Ocorreu um erro ao criar o vendedor: ${error.message}`,
        type: "error",
      });
    },
  });
};
