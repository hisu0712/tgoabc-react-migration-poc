import { fetchShop } from "@/api/shop";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useShopData(memberId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.shop.byId(memberId!),
    queryFn: () => fetchShop(memberId!),
  });
}
