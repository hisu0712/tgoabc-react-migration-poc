export const QUERY_KEYS = {
  shop: {
    all: ["shop"],
    byId: (memberId: string) => ["shop", memberId],
  },
  member: {
    all: ["member"],
    byId: (memberId: string) => ["member", memberId],
  },
  customer: {
    all: ["customer"],
    memberList: (memberId: string, keyword?: string) => [
      "customer",
      "memberList",
      memberId,
      keyword,
    ],
    byId: (customerId: string) => ["customer", customerId],
  },
};

export const BUCKET_NAME = "uploads";

export const GENDER_FORM_VALUES = [
  { value: "M", label: "남" },
  { value: "F", label: "여" },
] as const;
