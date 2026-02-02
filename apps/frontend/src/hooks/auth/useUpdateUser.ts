import { toaster } from "@/components/ui/toaster";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/AuthStore";
import { useMutation } from "@tanstack/react-query";

interface UpdateUserRequest {
  name: string;
  image?: string;
  managerFixedCommission?: number;
  managerPercentCommission?: number;
}

export const useUpdateUser = () => {
  const { refreshUser } = useAuthStore();
  return useMutation({
    mutationFn: async (data: UpdateUserRequest) => {
      return authClient.updateUser({
        image: data.image,
        name: data.name,
        managerFixedCommission: data.managerFixedCommission,
        managerPercentCommission: data.managerPercentCommission,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    },
    onSuccess: () => {
      refreshUser();
      toaster.create({
        title: "Usuário atualizado com sucesso",
        type: "success",
      });
    },
    onError: () => {
      toaster.create({
        title: "Erro ao atualizar usuário",
        type: "error",
      });
    },
  });
};
