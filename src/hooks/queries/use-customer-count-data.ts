import { fetchCustomerCountByMember } from "@/api/customer";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export default function useCustomerCount(memberId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.customer.memberCount(memberId!),
    queryFn: () => fetchCustomerCountByMember(memberId!),
    enabled: !!memberId,
  });
}
