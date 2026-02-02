import {
  Dialog,
  Button,
  Portal,
  Stack,
  Field,
  Input,
  InputGroup,
  Icon,
  Select,
  createListCollection,
  Text,
} from "@chakra-ui/react";
import { LuText } from "react-icons/lu";
import { CreateSaleRequestSchema } from "@app/backend/src/modules/schemas/sales.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { Controller } from "react-hook-form";
import { NumberInputField, NumberInputRoot } from "../../ui/number-input";
import { useCreateSale, useListAllSellers } from "@/hooks";

type SaleCreateRequestSchemaType = z.infer<typeof CreateSaleRequestSchema>;

export const CreateSaleDialog = ({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
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
      amount: 0,
    },
  });

  const { mutateAsync: createSale, isPending } = useCreateSale();

  const { data: sellers } = useListAllSellers();

  const sellersCollection = createListCollection({
    items:
      sellers?.map((seller) => ({
        id: seller.id,
        name: seller.name,
      })) ?? [],
    itemToString: (item) => item.name,
    itemToValue: (item) => item.id,
  });

  const onSubmit = async (data: SaleCreateRequestSchemaType) => {
    reset();
    await createSale({
      data: {
        sellerId: data.sellerId,
        amount: data.amount,
        description: data.description,
      },
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
              <Dialog.Title>Criar venda</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack
                as={"form"}
                id="create-sale-form"
                gap={4}
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  control={control}
                  name="sellerId"
                  render={({ field }) => (
                    <Select.Root
                      name={field.name}
                      value={field.value ? [field.value] : []}
                      onValueChange={(e) => field.onChange(e.value[0])}
                      collection={sellersCollection}
                      size="sm"
                      width="full"
                    >
                      <Select.HiddenSelect />
                      <Select.Label>Vendedor</Select.Label>
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
                  )}
                />

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
