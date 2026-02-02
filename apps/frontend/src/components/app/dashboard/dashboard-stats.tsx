import { Card, SimpleGrid } from "@chakra-ui/react";
import {
  StatLabel,
  StatRoot,
  StatValueText,
  StatHelpText,
} from "@/components/ui/stat";
import { listSalesResponseSchema } from "@app/backend/src/modules/schemas/sales.schema";
import type { z } from "zod";

type Sale = z.infer<typeof listSalesResponseSchema>[number];

interface DashboardStatsProps {
  sales: Sale[];
}

export const DashboardStats = ({ sales }: DashboardStatsProps) => {
  const totalSales = sales.length;
  const totalAmount = sales.reduce((acc, sale) => acc + Number(sale.amount), 0);
  const totalCommission = sales.reduce(
    (acc, sale) => acc + Number(sale.managerComm),
    0,
  );

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
      <Card.Root>
        <Card.Body p={6}>
          <StatRoot>
            <StatLabel>Vendas Totais</StatLabel>
            <StatValueText
              color={"brand.cyan"}
              value={totalAmount}
              formatOptions={{ style: "currency", currency: "BRL" }}
            />
            <StatHelpText>Valor total vendido</StatHelpText>
          </StatRoot>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Body p={6}>
          <StatRoot>
            <StatLabel>Minhas Comissões</StatLabel>
            <StatValueText
              color={"brand.cyan"}
              value={totalCommission}
              formatOptions={{ style: "currency", currency: "BRL" }}
            />
            <StatHelpText>Total comissionado</StatHelpText>
          </StatRoot>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Body p={6}>
          <StatRoot>
            <StatLabel>Quantidade de Vendas</StatLabel>
            <StatValueText color={"brand.cyan"} value={totalSales} />
            <StatHelpText>Número de vendas registradas</StatHelpText>
          </StatRoot>
        </Card.Body>
      </Card.Root>
    </SimpleGrid>
  );
};
