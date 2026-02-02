import { useMutation } from "@tanstack/react-query";
import { CreateSaleRequestSchema } from "@app/backend/src/modules/schemas/sales.schema";
import type z from "zod";
import { api } from "@/lib/api";
import { toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";

type CreateSaleRequestSchemaType = z.infer<typeof CreateSaleRequestSchema>;

export const useCreateSale = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: CreateSaleRequestSchemaType }) => {
      const response = await api.api.sales.post(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
      toaster.create({
        title: "Venda criada com sucesso",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Erro ao criar venda",
        type: "error",
      });
    },
  });
};
