import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useListSalesFromUser = (filters?: {
  sellerId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}) => {
  return useQuery({
    queryKey: ["sales", filters],
    queryFn: async () => {
      const query = {
        sellerId: filters?.sellerId ?? undefined,
        startDate: filters?.startDate ?? undefined,
        endDate: filters?.endDate ?? undefined,
      };
      const response = await api.api.sales.get({
        query: query,
      });
      return response;
    },
  });
};
