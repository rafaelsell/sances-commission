import {
  Dialog,
  Button,
  Portal,
  Stack,
  Field,
  Input,
  InputGroup,
  Icon,
  Text,
} from "@chakra-ui/react";
import { LuText } from "react-icons/lu";
import {
  CreateSaleRequestSchema,
  type UpdateSaleRequestDTO,
} from "@app/backend/src/modules/schemas/sales.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { Controller } from "react-hook-form";
import { NumberInputField, NumberInputRoot } from "../../ui/number-input";
import { useUpdateSale } from "@/hooks";

type SaleCreateRequestSchemaType = z.infer<typeof CreateSaleRequestSchema>;

export const EditSaleDialog = ({
  open,
  setIsOpen,
  selectedSale,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedSale: {
    id: string;
    amount: string;
    description: string;
    sellerId: string;
  };
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SaleCreateRequestSchemaType>({
    resolver: zodResolver(CreateSaleRequestSchema),
    defaultValues: {
      amount: Number.parseFloat(selectedSale.amount),
      description: selectedSale.description!,
      sellerId: selectedSale.sellerId!,
    },
  });

  const { mutateAsync: updateSale, isPending } = useUpdateSale();

  const onSubmit = async (data: UpdateSaleRequestDTO) => {
    reset();
    await updateSale({
      body: {
        amount: data.amount,
        description: data.description,
        sellerId: data.sellerId,
      },
      saleId: selectedSale.id,
    });
    setIsOpen(false);
  };
  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setIsOpen(e.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Editar venda</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack
                as={"form"}
                id="create-sale-form"
                gap={4}
                onSubmit={handleSubmit(onSubmit)}
              >
                <Field.Root invalid={!!errors.amount}>
                  <Field.Label fontSize={"xs"}>Valor</Field.Label>
                  <Controller
                    control={control}
                    name="amount"
                    render={({ field }) => (
                      <NumberInputRoot
                        name={field.name}
                        value={field.value.toString()}
                        onValueChange={(e) => {
                          const value = parseFloat(e.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                        min={0}
                        step={0.01}
                        width="full"
                      >
                        <InputGroup startAddon={<Text>R$</Text>} width="full">
                          <NumberInputField
                            borderRadius={"lg"}
                            focusRingColor={"brand.cyan"}
                          />
                        </InputGroup>
                      </NumberInputRoot>
                    )}
                  />
                  <Field.ErrorText>{errors.amount?.message}</Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!errors.description}>
                  <Field.Label fontSize={"xs"}>Descrição</Field.Label>
                  <InputGroup
                    startElement={<Icon as={LuText} color={"gray.400"} />}
                  >
                    <Input
                      {...register("description")}
                      borderRadius={"lg"}
                      focusRingColor={"brand.cyan"}
                    />
                  </InputGroup>
                  <Field.ErrorText>
                    {errors.description?.message}
                  </Field.ErrorText>
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button borderRadius={"lg"} variant="subtle">
                  Cancelar
                </Button>
              </Dialog.ActionTrigger>
              <Button
                borderRadius={"lg"}
                bgColor={"brand.cyan"}
                _hover={{
                  filter: "brightness(0.96)",
                }}
                type="submit"
                form="create-sale-form"
                loading={isPending}
              >
                Salvar
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
