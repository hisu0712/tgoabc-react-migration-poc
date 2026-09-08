import { fetchCustomerCountByMember } from "@/api/customer";
import { QUERY_KEYS } from "@/constants/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useCustomerCount({
  memberId,
  keyword,
  designerId,
}: {
  memberId?: string;
  keyword?: string;
  designerId?: number;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.customer.memberCount(memberId!, keyword, designerId),
    queryFn: () =>
      fetchCustomerCountByMember({ memberId: memberId!, keyword, designerId }),
    enabled: !!memberId,
    placeholderData: keepPreviousData,
  });
}
