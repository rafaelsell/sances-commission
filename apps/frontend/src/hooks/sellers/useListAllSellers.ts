import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useListAllSellers = () => {
  return useQuery({
    queryKey: ["sellers"],
    queryFn: async () => {
      const response = await api.api.sellers.get();
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      return response.data;
    },
  });
};
