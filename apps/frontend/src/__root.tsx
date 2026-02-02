import { Stack } from "@chakra-ui/react";
import { Outlet } from "react-router";
import { AppBar } from "./components/app/appbar";
import { Navbar } from "./components/app/navbar";
import { PrivateRoute } from "./components/app/private-route";
export const RootLayout = () => {
  return (
    <Stack gap={0}>
      <PrivateRoute>
        <AppBar />
        <Stack direction={"row"} gap={0}>
          <Navbar />
          <Outlet />
        </Stack>
      </PrivateRoute>
    </Stack>
  );
};
