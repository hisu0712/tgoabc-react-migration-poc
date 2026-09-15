import { fetchCustomerCountByAgeGroup } from "@/api/customer";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export default function useCustomerCountByAgeGroup(memberId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.customer.countByAgeGroup(memberId!),
    queryFn: () => fetchCustomerCountByAgeGroup(memberId!),
    enabled: !!memberId,
  });
}
