import { PasswordInput } from "@/components/ui/password-input";
import {
  Button,
  Field,
  Icon,
  Input,
  InputGroup,
  Stack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import { LuLock, LuMail, LuUser } from "react-icons/lu";
import { useNavigate } from "react-router";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignup } from "@/hooks";

const signupSchema = z
  .object({
    name: z.string().min(3, { message: "Nome inválido" }),
    email: z.email({ message: "E-mail inválido" }),
    password: z
      .string()
      .min(6, { message: "Sua senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z.string().min(6, { message: "Senha inválida" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignupSchema = z.infer<typeof signupSchema>;

export const SignupPage = () => {
  const navigate = useNavigate();
  const { mutateAsync: signup, isPending } = useSignup();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupSchema) => {
    await signup(data);
    reset();
    setTimeout(() => {
      navigate("/login");
    }, 5000);
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
        <VStack align={"start"}>
          <Text
            pt={6}
            fontSize={"2xl"}
            color={"brand.navy"}
            fontWeight={"semibold"}
          >
            Vamos criar sua conta!
          </Text>
          <Text
            pb={6}
            fontSize={"md"}
            color={"brand.navy"}
            fontWeight={"normal"}
          >
            Preencha os campos abaixo para criar sua conta.
          </Text>
        </VStack>
        <Stack as={"form"} gap={4} onSubmit={handleSubmit(onSubmit)}>
          <Field.Root invalid={!!errors.name}>
            <Field.Label fontSize={"xs"}>Nome Completo</Field.Label>
            <InputGroup startElement={<Icon color={"gray.400"} as={LuUser} />}>
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
            <InputGroup startElement={<Icon color={"gray.400"} as={LuMail} />}>
              <Input
                {...register("email")}
                borderRadius={"lg"}
                focusRingColor={"brand.cyan"}
              />
            </InputGroup>
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.password}>
            <Field.Label fontSize={"xs"}>Senha</Field.Label>
            <InputGroup startElement={<Icon color={"gray.400"} as={LuLock} />}>
              <PasswordInput
                {...register("password")}
                borderRadius={"lg"}
                focusRingColor={"brand.cyan"}
              />
            </InputGroup>
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.confirmPassword}>
            <Field.Label fontSize={"xs"}>Confirmar Senha</Field.Label>
            <InputGroup startElement={<Icon color={"gray.400"} as={LuLock} />}>
              <PasswordInput
                {...register("confirmPassword")}
                borderRadius={"lg"}
                focusRingColor={"brand.cyan"}
              />
            </InputGroup>
            <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
          </Field.Root>
          <Button
            borderRadius={"lg"}
            bgColor={"brand.cyan"}
            _hover={{
              filter: "brightness(0.96)",
            }}
            type="submit"
            loading={isPending}
          >
            Registrar
          </Button>
          <Button
            onClick={() => navigate("/login")}
            borderRadius={"lg"}
            variant={"subtle"}
          >
            Voltar ao login
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
