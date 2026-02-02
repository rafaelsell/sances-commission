import { toaster } from "@/components/ui/toaster";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import type { UpdateSaleRequestDTO } from "@backend/modules/schemas/sales.schema";
import { useMutation } from "@tanstack/react-query";

export const useUpdateSale = () => {
  return useMutation({
    mutationKey: ["sales"],
    mutationFn: async ({
      body,
      saleId,
    }: {
      body: UpdateSaleRequestDTO;
      saleId: string;
    }) => {
      const response = await api.api.sales({ saleId: saleId }).put(body);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toaster.create({
        title: "Sucesso",
        description: "Venda atualizada com sucesso",
        type: "success",
      });
    },
    onError: (e) => {
      toaster.create({
        title: "Erro ao editar venda",
        description: e.message,
        type: "error",
      });
    },
  });
};
