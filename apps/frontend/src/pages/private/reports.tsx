import { Stack, Text, VStack, SimpleGrid } from "@chakra-ui/react";
import { useListSalesFromUser } from "@/hooks/sales/useListSalesFromUser";
import { SalesEvolutionChart } from "@/components/app/reports/sales-evolution-chart";
import { SellersRankingChart } from "@/components/app/reports/sellers-ranking-chart";
import { CommissionDistributionChart } from "@/components/app/reports/commission-distribution-chart";

export const ReportsPage = () => {
  const { data: sales, isLoading } = useListSalesFromUser();
  const salesData = sales?.data ?? [];

  return (
    <Stack bgColor={"brand.gray.50"} w={"full"} p={8} gap={6}>
      <Stack
        direction={"row"}
        bgColor={"white"}
        p={8}
        rounded={"lg"}
        boxShadow={"md"}
        w={"full"}
        justifyContent={"space-between"}
      >
        <VStack align={"start"}>
          <Text fontSize={"2xl"} fontWeight={"semibold"}>
            Relatórios
          </Text>
          <Text fontSize={"md"}>
            Analise o desempenho das suas vendas e comissões.
          </Text>
        </VStack>
      </Stack>

      {!isLoading && (
        <Stack gap={6}>
          <SalesEvolutionChart sales={salesData} />
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            <SellersRankingChart sales={salesData} />
            <CommissionDistributionChart sales={salesData} />
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  );
};
