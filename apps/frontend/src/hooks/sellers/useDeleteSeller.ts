import { toaster } from "@/components/ui/toaster";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export const useDeleteSeller = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await api.api.sellers({ id }).delete();
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      toaster.create({
        title: "Vendedor deletado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Erro ao deletar vendedor",
        description: error.message,
        type: "error",
      });
    },
  });
};
