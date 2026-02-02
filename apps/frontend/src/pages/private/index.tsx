import { Stack, Text, VStack } from "@chakra-ui/react";
import { useAuthStore } from "@/stores/AuthStore";
import { useListSalesFromUser } from "@/hooks/sales/useListSalesFromUser";
import { DashboardStats } from "@/components/app/dashboard/dashboard-stats";
import { RecentSales } from "@/components/app/dashboard/recent-sales";

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { data: sales, isLoading } = useListSalesFromUser();

  const salesData = sales?.data ?? [];

  return (
    <Stack bgColor={"brand.gray.50"} w={"full"} p={8} gap={6}>
      <Stack
        direction={"row"}
        bgColor={"white"}
        p={8}
        rounded={"lg"}
        boxShadow={"sm"}
        w={"full"}
        justifyContent={"space-between"}
      >
        <VStack align={"start"}>
          <Text fontSize={"2xl"} fontWeight={"semibold"}>
            Olá, {user?.name} 👋
          </Text>
          <Text fontSize={"md"}>
            Aqui está o resumo das suas vendas e comissões.
          </Text>
        </VStack>
      </Stack>

      {!isLoading && (
        <>
          <DashboardStats sales={salesData} />
          <RecentSales sales={salesData} />
        </>
      )}
    </Stack>
  );
};
