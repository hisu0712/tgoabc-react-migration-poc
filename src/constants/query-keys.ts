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
    memberCount: (
      memberId: string,
      keyword?: string,
      designerId?: number,
      since?: string,
    ) => ["customer", "count", memberId, keyword, designerId, since],
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
    shared: (analysisId: string) => ["analysis", "shared", analysisId],
    customerList: (customerId: string, personalType?: string) => [
      "analysis",
      "customerList",
      customerId,
      personalType,
    ],
    memberList: (memberId: string) => ["analysis", "memberList", memberId],
    count: (memberId?: string, customerId?: string, personalType?: string) => [
      "analysis",
      "count",
      memberId,
      customerId,
      personalType,
    ],
  },
};
