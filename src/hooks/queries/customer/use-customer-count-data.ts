import { fetchCustomerCountByMember } from "@/api/customer";
import { QUERY_KEYS } from "@/constants/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useCustomerCount({
  memberId,
  keyword,
  designerId,
  since,
}: {
  memberId?: string;
  keyword?: string;
  designerId?: number;
  since?: string;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.customer.memberCount(
      memberId!,
      keyword,
      designerId,
      since,
    ),
    queryFn: () =>
      fetchCustomerCountByMember({
        memberId: memberId!,
        keyword,
        designerId,
        since,
      }),
    enabled: !!memberId,
    placeholderData: keepPreviousData,
  });
}
