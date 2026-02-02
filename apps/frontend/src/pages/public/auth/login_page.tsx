import {
  Button,
  Checkbox,
  Field,
  Icon,
  Image,
  Input,
  InputGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { LuLock, LuMail } from "react-icons/lu";
import { useLogin } from "@/hooks";

const loginSchema = z.object({
  email: z.email({ message: "E-mail inválido" }),
  password: z
    .string()
    .min(6, { message: "Sua senha deve ter pelo menos 6 caracteres" }),
  remember: z.boolean().default(false).optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { mutateAsync: login, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember: false,
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: LoginSchema) => {
    await login(data);
  };
  return (
    <Stack
      bgColor={"brand.gray.50"}
      w={"full"}
      minH={"100vh"}
      justify={"center"}
      align={"center"}
      px={4}
    >
      <Stack
        bgColor={"white"}
        rounded={"lg"}
        maxW={["full", "450px"]}
        p={[4, 8]}
        shadow={"lg"}
        w={["full"]}
      >
        <Image
          h={"50px"}
          src="/svg/logo-full.svg"
          alt="Sances"
          objectFit={"contain"}
        />
        <Text
          pt={6}
          fontSize={"2xl"}
          color={"brand.navy"}
          fontWeight={"semibold"}
        >
          Bem-vindo(a) de volta!
        </Text>
        <Text pb={6} fontSize={"md"} color={"brand.navy"} fontWeight={"normal"}>
          Faça login para continuar.
        </Text>
        <Stack as={"form"} onSubmit={handleSubmit(onSubmit)} w={"full"} gap={4}>
          <Field.Root invalid={!!errors.email}>
            <Field.Label fontSize={"xs"}>E-mail</Field.Label>
            <InputGroup startElement={<Icon color={"gray.400"} as={LuMail} />}>
              <Input
                borderRadius={"lg"}
                focusRingColor={"brand.cyan"}
                type="email"
                placeholder="rafael@sances.com"
                {...register("email")}
              />
            </InputGroup>
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.password}>
            <Field.Label fontSize={"xs"}>Senha</Field.Label>
            <InputGroup startElement={<Icon color={"gray.400"} as={LuLock} />}>
              <Input
                borderRadius={"lg"}
                focusRingColor={"brand.cyan"}
                placeholder="********"
                type="password"
                {...register("password")}
              />
            </InputGroup>
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>
          <Controller
            control={control}
            name="remember"
            render={({ field }) => (
              <Field.Root>
                <Checkbox.Root
                  size={"sm"}
                  checked={field.value}
                  onCheckedChange={({ checked }) => field.onChange(checked)}
                  value="remember"
                  my={2}
                >
                  <Checkbox.HiddenInput color="brand.cyan" />
                  <Checkbox.Control
                    _checked={{
                      bgColor: "brand.cyan",
                      color: "white",
                    }}
                    border={"none"}
                    bgColor={"gray.200"}
                    color="white"
                  />
                  <Checkbox.Label>Lembrar de mim</Checkbox.Label>
                </Checkbox.Root>
              </Field.Root>
            )}
          ></Controller>

          <Button
            borderRadius={"lg"}
            bgColor={"brand.cyan"}
            _hover={{
              filter: "brightness(0.96)",
            }}
            type="submit"
            loading={isPending}
          >
            Entrar
          </Button>
          <Button
            onClick={() => navigate("/signup")}
            borderRadius={"lg"}
            variant={"subtle"}
          >
            Criar conta
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
