import { Card, Heading, Stack } from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { listSalesResponseSchema } from "@app/backend/src/modules/schemas/sales.schema";
import type { z } from "zod";
import { useMemo } from "react";
import { format, subDays, isAfter } from "date-fns";

type Sale = z.infer<typeof listSalesResponseSchema>[number];

interface SalesEvolutionChartProps {
  sales: Sale[];
}

export const SalesEvolutionChart = ({ sales }: SalesEvolutionChartProps) => {
  const chartData = useMemo(() => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const filteredSales = sales.filter((sale) =>
      isAfter(new Date(sale.date), thirtyDaysAgo),
    );

    const grouped = filteredSales.reduce(
      (acc, sale) => {
        const dateStr = format(new Date(sale.date), "yyyy-MM-dd");
        if (!acc[dateStr]) {
          acc[dateStr] = 0;
        }
        acc[dateStr] += Number(sale.amount);
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(grouped)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, amount]) => ({
        date: format(new Date(date), "dd/MM"),
        fullDate: date,
        amount,
      }));
  }, [sales]);

  return (
    <Card.Root w="full" boxShadow="md">
      <Card.Body p={6}>
        <Stack gap={4}>
          <Heading size="md">Evolução de Vendas (30 dias)</Heading>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#888888"
                />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("pt-BR", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  }
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
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#00A3C4" // brand.cyan approx
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#00A3C4" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
