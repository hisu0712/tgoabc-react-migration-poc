import { fetchCustomerCountByGender } from "@/api/customer";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export default function useCustomerCountByGender(memberId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.customer.countByGender(memberId!),
    queryFn: () => fetchCustomerCountByGender(memberId!),
    enabled: !!memberId,
  });
}
