import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/AuthStore";
import { toaster } from "@/components/ui/toaster";

interface LoginSchema {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export const useLogin = () => {
  const { setSession, setUser } = useAuthStore();
  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      const response = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "http://localhost:5173/",
        rememberMe: data.rememberMe,
      });
      return response;
    },
    onSuccess: async ({ data: response }) => {
      if (response) {
        setUser(response?.user);
        const sessionResponse = await authClient.getSession();
        if (sessionResponse?.data?.session) {
          setSession(sessionResponse?.data?.session);
        }
      }
    },
    onError: (error) => {
      console.warn(error);
      toaster.create({
        title: "Erro ao fazer login",
        description: `Verifique suas credenciais: ${error.message}`,
        type: "error",
        duration: 5000,
      });
    },
  });
};
