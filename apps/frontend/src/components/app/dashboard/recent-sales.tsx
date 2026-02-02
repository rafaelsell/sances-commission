import { Card, Table, Stack, Text, Badge, Icon } from "@chakra-ui/react";
import { listSalesResponseSchema } from "@app/backend/src/modules/schemas/sales.schema";
import type { z } from "zod";
import { LuDollarSign } from "react-icons/lu";

type Sale = z.infer<typeof listSalesResponseSchema>[number];

interface RecentSalesProps {
  sales: Sale[];
}

export const RecentSales = ({ sales }: RecentSalesProps) => {
  const recentSales = sales.slice(0, 5);

  return (
    <Card.Root w="full">
      <Card.Header>
        <Text fontSize="lg" fontWeight="semibold">
          Vendas Recentes
        </Text>
      </Card.Header>
      <Card.Body p={4}>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Data</Table.ColumnHeader>
              <Table.ColumnHeader>Vendedor</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Valor</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">
                Comissão Vendedor
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">
                Minha Comissão
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {recentSales.map((sale) => (
              <Table.Row key={sale.id}>
                <Table.Cell>
                  {new Date(sale.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </Table.Cell>
                <Table.Cell>{sale.sellerName}</Table.Cell>
                <Table.Cell textAlign="end">
                  <Text fontWeight="medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(sale.amount))}
                  </Text>
                </Table.Cell>
                <Table.Cell textAlign="end">
                  <Badge colorPalette="green" variant="subtle">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(sale.sellerComm))}
                  </Badge>
                </Table.Cell>
                <Table.Cell textAlign="end">
                  <Badge colorPalette="blue" variant="subtle">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(sale.managerComm))}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
            {recentSales.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={5} textAlign="center">
                  <Stack align="center" py={8} color="gray.500">
                    <Icon as={LuDollarSign} boxSize={8} />
                    <Text>Nenhuma venda recente</Text>
                  </Stack>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Card.Body>
    </Card.Root>
  );
};
