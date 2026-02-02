import { createBrowserRouter } from "react-router";
import { RootLayout } from "./__root";
import { DashboardPage } from "./pages/private";
import { LoginPage } from "./pages/public/auth/login_page";
import { SignupPage } from "./pages/public/auth/signup_page";
import { SellersPage } from "./pages/private/sellers-page";
import { EditUserPage } from "./pages/private/edit-user";
import { SalesPage } from "./pages/private/sales-page";
import { ReportsPage } from "./pages/private/reports";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "/sellers",
        element: <SellersPage />,
      },
      {
        path: "/edit-user",
        element: <EditUserPage />,
      },
      {
        path: "/sales",
        element: <SalesPage />,
      },
      {
        path: "/reports",
        element: <ReportsPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);
