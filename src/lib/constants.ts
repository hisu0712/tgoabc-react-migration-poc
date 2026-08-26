import {
  BarChart,
  Home,
  MapPin,
  MessageCircle,
  Settings,
  Users,
} from "lucide-react";

export const QUERY_KEYS = {
  shop: {
    all: ["shop"],
    byId: (memberId: string) => ["shop", memberId],
    customerList: (customerId: string) => ["shop", customerId],
  },
  member: {
    all: ["member"],
    byId: (memberId: string) => ["member", memberId],
  },
  customer: {
    all: ["customer"],
    memberList: (memberId: string, keyword?: string, designerId?: number) => [
      "customer",
      "memberList",
      memberId,
      keyword,
      designerId,
    ],
    memberCount: (memberId: string) => ["customer", "count", memberId],
    byId: (customerId: string) => ["customer", customerId],
  },
  designer: {
    all: ["designer"],
    memberList: (memberId: string) => ["designer", memberId],
    byId: (id: number) => ["designer", id],
  },
  analysis: {
    all: ["analysis"],
    byId: (analysisId: string) => ["analysis", analysisId],
    customerList: (customerId: string) => [
      "analysis",
      "customerList",
      customerId,
    ],
  },
};

export const BUCKET_NAME = "uploads";

export const GENDER_FORM_VALUES = [
  { value: "M", label: "남" },
  { value: "F", label: "여" },
] as const;

export const MEMBER_NAV_ITEMS = [
  { to: "/", label: "홈", icon: Home },
  { to: "/customers", label: "고객목록", icon: Users },
  { to: "/dashboard", label: "대시보드", icon: BarChart },
  { to: "/settings", label: "설정", icon: Settings },
];
export const CUSTOMER_NAV_ITEMS = [
  { to: "/portal", label: "홈", icon: Home },
  { to: "/portal-1", label: "메시지", icon: MessageCircle },
  { to: "/portal-2", label: "매장찾기", icon: MapPin },
  { to: "/portal-settings", label: "설정", icon: Settings },
];
