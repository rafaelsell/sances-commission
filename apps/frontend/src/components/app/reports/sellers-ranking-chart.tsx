import { Card, Heading, Stack } from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { listSalesResponseSchema } from "@app/backend/src/modules/schemas/sales.schema";
import type { z } from "zod";
import { useMemo } from "react";

type Sale = z.infer<typeof listSalesResponseSchema>[number];

interface SellersRankingChartProps {
  sales: Sale[];
}

export const SellersRankingChart = ({ sales }: SellersRankingChartProps) => {
  const data = useMemo(() => {
    const grouped = sales.reduce(
      (acc, sale) => {
        if (!acc[sale.sellerName]) {
          acc[sale.sellerName] = 0;
        }
        acc[sale.sellerName] += Number(sale.amount);
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(grouped)
      .map(([name, amount]) => ({
        name,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 7); // Top 7
  }, [sales]);

  return (
    <Card.Root w="full" boxShadow="md">
      <Card.Body p={6}>
        <Stack gap={4}>
          <Heading size="md">Ranking de Vendedores</Heading>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                  stroke="#888888"
                />
                <Tooltip
                  formatter={(value: number | undefined) =>
                    value !== undefined
                      ? new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(value)
                      : ""
                  }
                  cursor={{ fill: "transparent" }}
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={32}>
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#00A3C4" : "#2B6CB0"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
