import {
  Button,
  createListCollection,
  HStack,
  Icon,
  IconButton,
  Portal,
  Select,
  Stack,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";

import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { useListSalesFromUser } from "@/hooks/sales/useListSalesFromUser";
import { useListAllSellers } from "@/hooks/sellers/useListAllSellers";
import { useState } from "react";
import { CreateSaleDialog } from "@/components/app/sales/create-sale-dialog";
import { ConfirmActionDialog } from "@/components/app/confirm-action-dialog";
import { useDeleteSales } from "@/hooks/sales/useDeleteSales";
import { EditSaleDialog } from "@/components/app/sales/edit-sale-dialog";
import { listSalesResponseSchema } from "@app/backend/src/modules/schemas/sales.schema";
import type { z } from "zod";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

type Sale = z.infer<typeof listSalesResponseSchema>[number];

export const SalesPage = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedSeller, setSelectedSeller] = useState<string[]>([]);

  const { data: sales } = useListSalesFromUser({
    sellerId: selectedSeller[0],
    startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
  });

  const { data: sellers } = useListAllSellers();
  const { mutateAsync: deleteSale } = useDeleteSales();
  const [openCreateSaleDialog, setOpenCreateSaleDialog] = useState(false);
  const [openEditSaleDialog, setOpenEditSaleDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [confirmDeleteModalisOpen, setConfirmDeleteModalisOpen] =
    useState(false);

  const sellersCollection = createListCollection({
    items:
      sellers?.map((seller) => ({
        id: seller.id,
        name: seller.name,
      })) ?? [],
    itemToString: (item) => item.name,
    itemToValue: (item) => item.id,
  });

  return (
    <Stack bgColor={"brand.gray.50"} w={"full"} p={8}>
      <Stack gap={4}>
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
              Vendas
            </Text>
            <Text fontSize={"md"}>Aqui você pode gerenciar suas vendas</Text>
          </VStack>

          <HStack>
            <Button
              bgColor={"brand.cyan"}
              _hover={{
                filter: "brightness(0.96)",
              }}
              size={"lg"}
              colorScheme="brand"
              variant="solid"
              onClick={() => {
                setOpenCreateSaleDialog(true);
              }}
            >
              <Icon as={LuPlus} />
              Adicionar
            </Button>
          </HStack>
        </Stack>

        <Stack
          direction={"row"}
          bgColor={"white"}
          p={8}
          rounded={"lg"}
          boxShadow={"sm"}
          w={"full"}
          justifyContent={"space-between"}
        >
          <HStack width={"full"} gap={4}>
            <Select.Root
              value={selectedSeller}
              onValueChange={(e) => setSelectedSeller(e.value)}
              collection={sellersCollection}
              size="sm"
              width="320px"
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Selecione o vendedor" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {sellersCollection.items.map((seller) => (
                      <Select.Item item={seller} key={seller.id}>
                        {seller.name}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            <DatePicker
              selected={startDate}
              onSelect={setStartDate}
              placeholder="Data Inicial"
            />
            <DatePicker
              selected={endDate}
              onSelect={setEndDate}
              placeholder="Data Final"
            />
          </HStack>
        </Stack>
        <Stack
          bgColor={"white"}
          p={8}
          rounded={"lg"}
          boxShadow={"sm"}
          w={"full"}
        >
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Data</Table.ColumnHeader>
                <Table.ColumnHeader>Vendedor</Table.ColumnHeader>
                <Table.ColumnHeader>Valor</Table.ColumnHeader>
                <Table.ColumnHeader>Comissão Vendedor</Table.ColumnHeader>
                <Table.ColumnHeader>Comissão Gerente</Table.ColumnHeader>
                <Table.ColumnHeader>Descrição</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {sales?.data?.map((sale) => (
                <Table.Row key={sale.id}>
                  <Table.Cell>
                    {new Date(sale.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Table.Cell>
                  <Table.Cell>{sale.sellerName}</Table.Cell>
                  <Table.Cell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(sale.amount))}
                  </Table.Cell>
                  <Table.Cell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(sale.sellerComm))}
                  </Table.Cell>
                  <Table.Cell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(sale.managerComm))}
                  </Table.Cell>
                  <Table.Cell>{sale.description || "-"}</Table.Cell>
                  <Table.Cell textAlign="end">
                    <HStack w={"full"} justifyContent={"flex-end"}>
                      <IconButton
                        size={"md"}
                        variant={"plain"}
                        rounded={"full"}
                        className="group"
                        onClick={() => {
                          setSelectedSale(sale);
                          setOpenEditSaleDialog(true);
                        }}
                      >
                        <Icon
                          _groupHover={{ color: "yellow.600" }}
                          as={LuPencil}
                        />
                      </IconButton>
                      <IconButton
                        size={"md"}
                        variant={"plain"}
                        rounded={"full"}
                        className="group"
                        onClick={() => {
                          setSelectedSale(sale);
                          setConfirmDeleteModalisOpen(true);
                        }}
                      >
                        <Icon _groupHover={{ color: "red" }} as={LuTrash} />
                      </IconButton>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Stack>
      </Stack>

      <CreateSaleDialog
        open={openCreateSaleDialog}
        setIsOpen={setOpenCreateSaleDialog}
      />
      {selectedSale && (
        <ConfirmActionDialog
          open={confirmDeleteModalisOpen}
          onOpenChange={(details) => {
            setConfirmDeleteModalisOpen(details.open);
            setSelectedSale(null);
          }}
          title="Confirmar exclusão"
          description="Tem certeza que deseja excluir esta venda?"
          onConfirm={() => {
            deleteSale({ id: selectedSale.id });
          }}
          confirmText="Excluir"
          cancelText="Cancelar"
          type="danger"
        />
      )}

      {selectedSale && (
        <EditSaleDialog
          open={openEditSaleDialog}
          setIsOpen={setOpenEditSaleDialog}
          selectedSale={{
            id: selectedSale.id,
            amount: selectedSale.amount,
            description: selectedSale.description!,
            sellerId: selectedSale.sellerId,
          }}
        />
      )}
    </Stack>
  );
};
