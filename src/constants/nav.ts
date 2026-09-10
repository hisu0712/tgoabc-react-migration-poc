import { CUSTOMER_HOME_PATH, MEMBER_HOME_PATH } from "@/lib/route";
import {
  BarChartIcon,
  HomeIcon,
  MapPinIcon,
  MessageCircleIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

export const MEMBER_NAV_ITEMS = [
  { to: MEMBER_HOME_PATH, label: "홈", icon: HomeIcon },
  { to: "/customers", label: "고객목록", icon: UsersIcon },
  { to: "/dashboard", label: "대시보드", icon: BarChartIcon },
  { to: "/settings", label: "설정", icon: SettingsIcon },
];
export const CUSTOMER_NAV_ITEMS = [
  { to: CUSTOMER_HOME_PATH, label: "홈", icon: HomeIcon },
  {
    to: "#",
    label: "메시지",
    icon: MessageCircleIcon,
    disabled: true,
  },
  {
    to: "#",
    label: "매장찾기",
    icon: MapPinIcon,
    disabled: true,
  },
  { to: "/portal-settings", label: "설정", icon: SettingsIcon },
];
