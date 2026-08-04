export const QUERY_KEYS = {
  shop: {
    all: ["shop"],
    byId: (userId: string) => ["shop", "list", userId],
  },
};
