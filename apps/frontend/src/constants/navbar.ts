import type { IconType } from "react-icons";
import { LuBadgeDollarSign, LuChartArea, LuUsers } from "react-icons/lu";

interface NavbarItem {
  title: string;
  path: string;
  icon?: IconType;
}

export const navbarItems: NavbarItem[] = [
  {
    title: "Vendedores",
    path: "/sellers",
    icon: LuUsers,
  },
  {
    title: "Vendas",
    path: "/sales",
    icon: LuBadgeDollarSign,
  },
  {
    title: "Relatórios",
    path: "/reports",
    icon: LuChartArea,
  },
];
