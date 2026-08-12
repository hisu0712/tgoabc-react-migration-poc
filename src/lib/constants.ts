export const QUERY_KEYS = {
  shop: {
    all: ["shop"],
    byId: (userId: string) => ["shop", userId],
  },
  member: {
    all: ["member"],
    byId: (userId: string) => ["member", userId],
  },
  customer: {
    all: ["customer"],
    list: ["customer", "list"],
    byId: (customerId: string) => ["customer", customerId],
  },
};

export const BUCKET_NAME = "uploads";

export const GENDER_FORM_VALUES = [
  { value: "M", label: "남" },
  { value: "F", label: "여" },
] as const;
