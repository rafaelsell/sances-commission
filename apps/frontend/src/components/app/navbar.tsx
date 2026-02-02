import { navbarItems } from "@/constants";
import { useGlobalStore } from "@/stores/GlobalStore";
import { Box, Button, Icon, SimpleGrid, Stack } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import { Link } from "react-router";

export const Navbar = () => {
  const { isDrawerOpen } = useGlobalStore();

  return (
    <Stack
      zIndex={1}
      overflow={"hidden"}
      w={isDrawerOpen ? "350px" : "0px"}
      transition={"all 600ms"}
      minH={"calc(100vh - 80px)"}
      bgColor={"white"}
      shadow={"md"}
    >
      <SimpleGrid px={4} py={8} gap={6} w={"100%"}>
        {navbarItems.map((item) => (
          <Link to={item.path} key={item.title}>
            <Button
              className="group"
              w={"100%"}
              gap={2}
              variant={"plain"}
              paddingInline={0}
              h={"min-content"}
              _hover={{
                color: "black",
              }}
              color={"blackAlpha.700"}
              size={"lg"}
            >
              <Icon as={item.icon} />
              {item.title}
              <Box w={"100%"} />
              <Icon
                transition={"all 800ms cubic-bezier( 0.48, 0.01, 0.19, 0.87 )"}
                transform={"translateX(-30px)"}
                opacity={0}
                _groupHover={{
                  opacity: 1,
                  transform: "translateX(0px)",
                }}
                as={LuChevronRight}
              />
            </Button>
          </Link>
        ))}
      </SimpleGrid>
    </Stack>
  );
};
