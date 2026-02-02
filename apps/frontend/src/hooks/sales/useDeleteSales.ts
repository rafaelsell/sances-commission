import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { toaster } from "@/components/ui/toaster";

export const useDeleteSales = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await api.api.sales({ saleId: id }).delete();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sales"],
      });
      toaster.create({
        title: "Venda deletada com sucesso",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Erro ao deletar venda",
        type: "error",
      });
    },
  });
};
