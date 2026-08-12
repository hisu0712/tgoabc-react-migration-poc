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
    byId: (customerId: string) => ["member", "list", customerId],
  },
};

export const BUCKET_NAME = "uploads";
