import { fetchAnalysesByCustomer } from "@/api/analysis";
import { QUERY_KEYS } from "@/lib/constants";
import { useInfiniteQuery } from "@tanstack/react-query";

const PAGE_SIZE = 10;

export default function useInfiniteAnalyses({
  customerId,
  personalType,
}: {
  customerId: string;
  personalType?: string;
}) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.analysis.customerList(customerId, personalType),
    queryFn: ({ pageParam }) => {
      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      return fetchAnalysesByCustomer({
        from,
        to,
        customerId,
        personalType,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length;
    },
    staleTime: Infinity,
    enabled: !!customerId,
  });
}
