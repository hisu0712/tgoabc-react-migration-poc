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
};

export const BUCKET_NAME = "uploads";

export const GENDER_FORM_VALUES = [
  { value: "M", label: "남" },
  { value: "F", label: "여" },
] as const;
