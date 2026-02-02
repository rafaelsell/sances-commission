import {
  Button,
  Field,
  Input,
  Stack,
  Text,
  VStack,
  InputGroup,
  Icon,
} from "@chakra-ui/react";
import { useAuthStore } from "@/stores/AuthStore";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuHash } from "react-icons/lu";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import { useUpdateUser } from "@/hooks/auth/useUpdateUser";

const UserUpdateSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  image: z.string().url("URL da imagem inválida").optional().or(z.literal("")),
  managerFixedCommission: z.coerce.number().min(0).optional(),
  managerPercentCommission: z.coerce.number().min(0).max(100).optional(),
});

type UserUpdateSchemaType = z.infer<typeof UserUpdateSchema>;

export const EditUserPage = () => {
  const { user } = useAuthStore();
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      name: user?.name || "",
      image: user?.image || "",
      managerFixedCommission: user?.managerFixedCommission || 0,
      managerPercentCommission: user?.managerPercentCommission || 0,
    },
  });

  const onSubmit = async (data: UserUpdateSchemaType) => {
    updateUser({
      ...data,
    });
  };
  if (!user) {
    return (
      <Stack p={8}>
        <Text>Carregando usuário...</Text>
      </Stack>
    );
  }

  return (
    <Stack bgColor={"brand.gray.50"} w={"full"} p={8} gap={8}>
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
              Editar usuário
            </Text>
            <Text fontSize={"md"}>
              Aqui você pode editar as informações do seu usuário
            </Text>
          </VStack>
        </Stack>
      </Stack>

      <Stack
        bgColor={"white"}
        p={8}
        rounded={"lg"}
        boxShadow={"sm"}
        w={"full"}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        gap={6}
      >
        <Field.Root invalid={!!errors.name}>
          <Field.Label>Nome</Field.Label>
          <Input {...register("name")} />
          <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root disabled>
          <Field.Label>Email</Field.Label>
          <Input value={user.email} readOnly variant="subtle" />
        </Field.Root>

        <Field.Root invalid={!!errors.image}>
          <Field.Label>URL da Imagem de Perfil</Field.Label>
          <Input {...register("image")} />
          <Field.ErrorText>{errors.image?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.managerFixedCommission}>
          <Field.Label>Comissão fixa</Field.Label>
          <Controller
            control={control}
            name="managerFixedCommission"
            render={({ field }) => (
              <NumberInputRoot
                name={field.name}
                value={field.value?.toString()}
                onValueChange={(e) => field.onChange(e.value)}
                min={0}
                step={0.01}
                width="full"
              >
                <InputGroup
                  startElement={<Icon as={LuHash} color={"gray.400"} />}
                  width="full"
                >
                  <NumberInputField />
                </InputGroup>
              </NumberInputRoot>
            )}
          />
          <Field.ErrorText>
            {errors.managerFixedCommission?.message}
          </Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.managerPercentCommission}>
          <Field.Label>Comissão percentual</Field.Label>
          <Controller
            control={control}
            name="managerPercentCommission"
            render={({ field }) => (
              <NumberInputRoot
                name={field.name}
                value={field.value?.toString()}
                onValueChange={(e) => field.onChange(e.value)}
                min={0}
                step={0.01}
                width="full"
              >
                <InputGroup
                  startElement={<Icon as={LuHash} color={"gray.400"} />}
                  width="full"
                >
                  <NumberInputField />
                </InputGroup>
              </NumberInputRoot>
            )}
          />
          <Field.ErrorText>
            {errors.managerPercentCommission?.message}
          </Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          loading={isSubmitting}
          bgColor="brand.cyan"
          color="white"
          alignSelf="flex-start"
          _hover={{ filter: "brightness(0.9)" }}
          disabled={isUpdatingUser}
        >
          Salvar Alterações
        </Button>
      </Stack>
    </Stack>
  );
};
