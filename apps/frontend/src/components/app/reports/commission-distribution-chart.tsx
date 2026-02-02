import { Card, Heading, Stack, HStack, Text, Box } from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { listSalesResponseSchema } from "@app/backend/src/modules/schemas/sales.schema";
import type { z } from "zod";
import { useMemo } from "react";

type Sale = z.infer<typeof listSalesResponseSchema>[number];

interface CommissionDistributionChartProps {
  sales: Sale[];
}

export const CommissionDistributionChart = ({
  sales,
}: CommissionDistributionChartProps) => {
  const data = useMemo(() => {
    const totalSellerComm = sales.reduce(
      (acc, sale) => acc + Number(sale.sellerComm),
      0,
    );
    const totalManagerComm = sales.reduce(
      (acc, sale) => acc + Number(sale.managerComm),
      0,
    );

    return [
      { name: "Vendedores", value: totalSellerComm },
      { name: "Gerente", value: totalManagerComm },
    ];
  }, [sales]);

  const COLORS = ["#00A3C4", "#38A169"]; // Cyan and Green

  return (
    <Card.Root w="full" boxShadow="md">
      <Card.Body p={6}>
        <Stack gap={4}>
          <Heading size="md">Distribuição de Comissões</Heading>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | undefined) =>
                    value !== undefined
                      ? new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(value)
                      : ""
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <HStack justify="center" gap={6}>
            {data.map((entry, index) => (
              <HStack key={entry.name}>
                <Box
                  w={3}
                  h={3}
                  rounded="full"
                  bg={COLORS[index % COLORS.length]}
                />
                <Text fontSize="sm" color="gray.600">
                  {entry.name}
                </Text>
              </HStack>
            ))}
          </HStack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
