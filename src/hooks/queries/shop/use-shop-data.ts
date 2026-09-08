import { fetchShop } from "@/api/shop";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useShopData(memberId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.shop.byId(memberId!),
    queryFn: () => fetchShop(memberId!),
  });
}
