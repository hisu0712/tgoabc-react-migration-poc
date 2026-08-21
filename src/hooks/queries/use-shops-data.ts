import { fetchShops } from "@/api/shop";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useShopsData(customerId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.shop.customerList(customerId!),
    queryFn: () => fetchShops(customerId!),
    enabled: !!customerId,
  });
}
