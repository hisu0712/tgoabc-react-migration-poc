export const QUERY_KEYS = {
  shop: {
    all: ["shop"],
    byId: (userId: string) => ["shop", "list", userId],
  },
  member: {
    all: ["member"],
    byId: (userId: string) => ["member", userId],
  },
};
