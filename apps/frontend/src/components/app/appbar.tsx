import { Stack, Image, IconButton, Menu, Icon, Box } from "@chakra-ui/react";
import { LuArrowLeft, LuLogOut, LuMenu, LuPencil } from "react-icons/lu";
import { useGlobalStore } from "@/stores/GlobalStore";
import { Avatar } from "@/components/ui/avatar";
import { useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/AuthStore";
import { Link, useNavigate } from "react-router";

export const AppBar = () => {
  const { isDrawerOpen, toggleDrawer } = useGlobalStore();
  const { setUser, setSession, user } = useAuthStore();
  const ref = useRef<HTMLDivElement | null>(null);
  const getAnchorRect = () => ref.current!.getBoundingClientRect();
  const navigate = useNavigate();

  return (
    <Stack
      zIndex={"docked"}
      align={"center"}
      w="full"
      direction={"row"}
      justify={"space-between"}
      px={8}
      py={4}
      bgColor={"white"}
      shadow={"lg"}
    >
      <IconButton
        bgColor={"transparent"}
        rounded={"full"}
        color={"black"}
        _hover={{
          bgColor: "blackAlpha.50",
        }}
        onClick={() => {
          toggleDrawer();
        }}
      >
        {isDrawerOpen ? <LuArrowLeft /> : <LuMenu />}
      </IconButton>
      <Link to={"/"}>
        <Image
          src="/svg/logo-full.svg"
          alt="Sances"
          objectFit={"contain"}
          h={"35px"}
        />
      </Link>
      <Menu.Root positioning={{ getAnchorRect }}>
        <Menu.Trigger asChild>
          <Avatar
            ref={ref}
            size={"xl"}
            name={user ? user.name : "Guest"}
            cursor="pointer"
            src={user?.image || undefined}
          />
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content w={"200px"}>
            <Menu.Item
              textWrap={"nowrap"}
              value="edit-user"
              onClick={() => {
                navigate("/edit-user");
              }}
            >
              Editar usuário
              <Box width={"100%"} />
              <Icon>
                <LuPencil />
              </Icon>
            </Menu.Item>
            <Menu.Item
              value="logout"
              onClick={() => {
                authClient.signOut();
                setUser(null);
                setSession(null);
              }}
            >
              Sair
              <Box width={"100%"} />
              <Icon>
                <LuLogOut />
              </Icon>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Stack>
  );
};
