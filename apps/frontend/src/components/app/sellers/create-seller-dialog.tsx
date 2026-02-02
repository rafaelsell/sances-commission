import {
  Dialog,
  Button,
  Portal,
  Stack,
  Field,
  Input,
  InputGroup,
  Icon,
} from "@chakra-ui/react";
import { LuHash, LuMail, LuUser } from "react-icons/lu";
import { SellerCreateRequestSchema } from "@app/backend/src/modules/schemas/sellers.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { Controller } from "react-hook-form";
import { NumberInputField, NumberInputRoot } from "../../ui/number-input";
import { useCreateSeller } from "@/hooks";

type SellerCreateRequestSchemaType = z.infer<typeof SellerCreateRequestSchema>;

export const CreateSellerDialog = ({
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
  } = useForm<SellerCreateRequestSchemaType>({
    resolver: zodResolver(SellerCreateRequestSchema),
    defaultValues: {
      fixedCommission: "0",
      percentageCommission: "0",
      name: "",
      email: "",
    },
  });

  const { mutateAsync: createSeller, isPending } = useCreateSeller();

  const onSubmit = async (data: SellerCreateRequestSchemaType) => {
    reset();
    await createSeller(data);
    setIsOpen(false);
  };
  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setIsOpen(e.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Criar vendedor</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack
                as={"form"}
                id="create-seller-form"
                gap={4}
                onSubmit={handleSubmit(onSubmit)}
              >
                <Field.Root invalid={!!errors.name}>
                  <Field.Label fontSize={"xs"}>Nome Completo</Field.Label>
                  <InputGroup
                    startElement={<Icon as={LuUser} color={"gray.400"} />}
                  >
                    <Input
                      {...register("name")}
                      borderRadius={"lg"}
                      focusRingColor={"brand.cyan"}
                    />
                  </InputGroup>
                  <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!errors.email}>
                  <Field.Label fontSize={"xs"}>E-mail</Field.Label>
                  <InputGroup
                    startElement={<Icon as={LuMail} color={"gray.400"} />}
                  >
                    <Input
                      {...register("email")}
                      borderRadius={"lg"}
                      focusRingColor={"brand.cyan"}
                    />
                  </InputGroup>
                  <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!errors.fixedCommission}>
                  <Field.Label fontSize={"xs"}>Comissão fixa</Field.Label>
                  <Controller
                    control={control}
                    name="fixedCommission"
                    render={({ field }) => (
                      <NumberInputRoot
                        name={field.name}
                        value={field.value}
                        onValueChange={(e) => field.onChange(e.value)}
                        min={0}
                        step={0.01}
                        width="full"
                      >
                        <InputGroup
                          startElement={<Icon as={LuHash} color={"gray.400"} />}
                          width="full"
                        >
                          <NumberInputField
                            borderRadius={"lg"}
                            focusRingColor={"brand.cyan"}
                          />
                        </InputGroup>
                      </NumberInputRoot>
                    )}
                  />
                  <Field.ErrorText>
                    {errors.fixedCommission?.message}
                  </Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!errors.percentageCommission}>
                  <Field.Label fontSize={"xs"}>Comissão percentual</Field.Label>
                  <Controller
                    control={control}
                    name="percentageCommission"
                    render={({ field }) => (
                      <NumberInputRoot
                        name={field.name}
                        value={field.value}
                        onValueChange={(e) => field.onChange(e.value)}
                        min={0}
                        step={0.01}
                        width="full"
                      >
                        <InputGroup
                          startElement={<Icon as={LuHash} color={"gray.400"} />}
                          width="full"
                        >
                          <NumberInputField
                            borderRadius={"lg"}
                            focusRingColor={"brand.cyan"}
                          />
                        </InputGroup>
                      </NumberInputRoot>
                    )}
                  />
                  <Field.ErrorText>
                    {errors.percentageCommission?.message}
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
                form="create-seller-form"
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
