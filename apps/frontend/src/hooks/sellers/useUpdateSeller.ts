import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { SellerUpdateRequestSchema } from "@app/backend/src/modules/schemas/sellers.schema";
import type z from "zod";
import { toaster } from "@/components/ui/toaster";

type SellerUpdateRequestSchemaType = z.infer<typeof SellerUpdateRequestSchema>;

export const useUpdateSeller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: SellerUpdateRequestSchemaType & { id: string },
    ) => {
      const { id, ...body } = data;
      const response = await api.api.sellers({ id }).put(body);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellers"] });
      toaster.create({
        title: "Vendedor atualizado com sucesso",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Erro ao atualizar vendedor",
        description: error.message,
        type: "error",
      });
    },
  });
};
