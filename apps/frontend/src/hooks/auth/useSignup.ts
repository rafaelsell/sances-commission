import { toaster } from "@/components/ui/toaster";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

interface SignupSchema {
  email: string;
  password: string;
  name: string;
}

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupSchema) => {
      const response = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "http://localhost:5173/",
      });
      return response;
    },
    onSuccess: () => {
      toaster.create({
        title: "Conta criada com sucesso",
        description: "Você será redirecionado para a página de login em breve",
        type: "success",
        duration: 5000,
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Erro ao criar conta",
        description: `Verifique suas credenciais: ${error.message}`,
        type: "error",
        duration: 5000,
      });
    },
  });
};
