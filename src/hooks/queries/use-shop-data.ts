import { fetchShop } from "@/api/shop";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useShopData(userId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.shop.byId(userId!),
    queryFn: () => fetchShop(userId!),
  });
}
