import { useDeleteSeller, useListAllSellers } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Button,
  HStack,
  Icon,
  IconButton,
  Stack,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { useState } from "react";
import { CreateSellerDialog } from "@/components/app/sellers/create-seller-dialog";
import { UpdateSellerDialog } from "@/components/app/sellers/update-seller-dialog";

import { SellerListResponseSchema } from "@app/backend/src/modules/schemas/sellers.schema";
import type { z } from "zod";
import { ConfirmActionDialog } from "@/components/app/confirm-action-dialog";

type SellerListResponseSchemaType = z.infer<typeof SellerListResponseSchema>;

export const SellersPage = () => {
  const [createSellerModalisOpen, setCreateSellerModalisOpen] = useState(false);
  const [updateSellerModalisOpen, setUpdateSellerModalisOpen] = useState(false);
  const [confirmDeleteModalisOpen, setConfirmDeleteModalisOpen] =
    useState(false);
  const [selectedSeller, setSelectedSeller] =
    useState<SellerListResponseSchemaType | null>(null);
  const { data: sellers, isLoading } = useListAllSellers();
  const { mutateAsync: deleteSeller } = useDeleteSeller();
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
              Vendedores
            </Text>
            <Text fontSize={"md"}>
              Aqui você pode gerenciar seus vendedores
            </Text>
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
              onClick={() => setCreateSellerModalisOpen(true)}
            >
              <Icon as={LuPlus} />
              Adicionar
            </Button>
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
                <Table.ColumnHeader>Nome Completo</Table.ColumnHeader>
                <Table.ColumnHeader>E-mail</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">
                  Comissão Fixa
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">
                  Comissão Percentual
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                    <Table.Cell>
                      <Skeleton height="20px" />
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <>
                  {sellers?.map((seller) => (
                    <Table.Row key={seller.id}>
                      <Table.Cell>{seller.name}</Table.Cell>
                      <Table.Cell>{seller.email}</Table.Cell>
                      <Table.Cell textAlign="end">
                        {seller.fixedCommission}
                      </Table.Cell>
                      <Table.Cell textAlign="end">
                        {Math.round(
                          Number.parseFloat(seller.percentageCommission),
                        )}
                        %
                      </Table.Cell>
                      <Table.Cell textAlign="end">
                        <HStack w={"full"} justifyContent={"flex-end"}>
                          <IconButton
                            size={"md"}
                            variant={"plain"}
                            rounded={"full"}
                            className="group"
                            onClick={() => {
                              setSelectedSeller(seller);
                              setUpdateSellerModalisOpen(true);
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
                              setSelectedSeller(seller);
                              setConfirmDeleteModalisOpen(true);
                            }}
                          >
                            <Icon _groupHover={{ color: "red" }} as={LuTrash} />
                          </IconButton>
                        </HStack>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </>
              )}
            </Table.Body>
          </Table.Root>
        </Stack>
      </Stack>
      <CreateSellerDialog
        open={createSellerModalisOpen}
        setIsOpen={setCreateSellerModalisOpen}
      />
      {selectedSeller && (
        <UpdateSellerDialog
          seller={selectedSeller}
          open={updateSellerModalisOpen}
          setIsOpen={setUpdateSellerModalisOpen}
        />
      )}
      {selectedSeller && (
        <ConfirmActionDialog
          open={confirmDeleteModalisOpen}
          onOpenChange={(details) => {
            setConfirmDeleteModalisOpen(details.open);
            setSelectedSeller(null);
          }}
          title="Confirmar exclusão"
          description="Tem certeza que deseja excluir este vendedor?"
          onConfirm={() => {
            deleteSeller({ id: selectedSeller.id });
          }}
          confirmText="Excluir"
          cancelText="Cancelar"
          type="danger"
        />
      )}
    </Stack>
  );
};
