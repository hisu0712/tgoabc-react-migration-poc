import { fetchCustomerCountByPeriod } from "@/api/customer";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { Granularity } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function useCustomerCountByPeriod({
  memberId,
  pivotDate,
  granularity,
}: {
  memberId?: string;
  pivotDate: string;
  granularity: Granularity;
}) {
  return useQuery({
    queryKey: QUERY_KEYS.customer.countByPeriod(
      memberId!,
      pivotDate,
      granularity,
    ),
    queryFn: () =>
      fetchCustomerCountByPeriod({
        memberId: memberId!,
        pivotDate,
        granularity,
      }),
    enabled: !!memberId,
  });
}
