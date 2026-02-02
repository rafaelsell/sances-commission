import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/AuthStore";
import { Spinner, Stack } from "@chakra-ui/react";
import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router";

export const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { session, setSession, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionResponse = await authClient.getSession();
        if (sessionResponse?.data?.session) {
          setSession(sessionResponse?.data?.session);
          setUser(sessionResponse?.data?.user);

          if (
            new Date(sessionResponse.data?.session.expiresAt).getTime() <
            Date.now()
          ) {
            await authClient.signOut();
            setSession(null);
            setUser(null);
          }
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to check session", error);
        setSession(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [setSession, setUser]);

  if (isLoading) {
    return (
      <Stack h="100vh" w="100vw" align="center" justify="center">
        <Spinner size="xl" color="brand.cyan" />
      </Stack>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
